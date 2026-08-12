#!/usr/bin/env python3
"""Extract the numbered word/meaning rows from the local GRE PDF.

This dependency-free extractor supports the PDF's compressed object streams and
embedded ToUnicode maps. The source contains word, part-of-speech abbreviations,
and Chinese meanings; fields not present in the source remain empty.
"""
from __future__ import annotations
import argparse, json, re, unicodedata, zlib
from pathlib import Path

OBJ_RE = re.compile(rb"(?m)^(\d+)\s+(\d+)\s+obj\b")

def unpack_objects(data: bytes) -> dict[int, bytes]:
    objects = {}
    for match in OBJ_RE.finditer(data):
        end = data.find(b"endobj", match.end())
        objects[int(match.group(1))] = data[match.end():end]
    for obj in list(objects.values()):
        if b"/ObjStm" not in obj: continue
        decoded = decode_stream(obj)
        count_match, first_match = re.search(rb"/N\s+(\d+)", obj), re.search(rb"/First\s+(\d+)", obj)
        if not decoded or not count_match or not first_match: continue
        count, first = int(count_match.group(1)), int(first_match.group(1))
        header = list(map(int, re.findall(rb"\d+", decoded[:first])))
        for index in range(count):
            number, offset = header[index * 2:index * 2 + 2]
            next_offset = header[index * 2 + 3] if index < count - 1 else len(decoded) - first
            objects[number] = decoded[first + offset:first + next_offset]
    return objects

def decode_stream(obj: bytes) -> bytes:
    start, end = re.search(rb"stream\r?\n", obj), obj.rfind(b"endstream")
    if not start or end < 0: return b""
    length_match = re.search(rb"/Length\s+(\d+)\b", obj[:start.start()])
    payload = obj[start.end():start.end() + int(length_match.group(1))] if length_match else obj[start.end():end].rstrip(b"\r\n")
    if b"/FlateDecode" in obj:
        try: return zlib.decompress(payload)
        except zlib.error: return b""
    return payload

def refs(value: bytes) -> list[int]: return [int(item) for item in re.findall(rb"(\d+)\s+0\s+R", value)]

def page_order(objects: dict[int, bytes], root: int) -> list[int]:
    ordered = []
    def visit(number: int):
        obj = objects[number]
        if re.search(rb"/Type\s*/Page\b", obj): ordered.append(number); return
        kids = re.search(rb"/Kids\s*\[(.*?)\]", obj, re.S)
        if kids:
            for child in refs(kids.group(1)): visit(child)
    visit(root)
    return ordered

def build_cmap(font: bytes, objects: dict[int, bytes]) -> dict[bytes, str]:
    target = re.search(rb"/ToUnicode\s+(\d+)\s+0\s+R", font)
    if not target: return {}
    source, mapping = decode_stream(objects[int(target.group(1))]), {}
    for block in re.findall(rb"beginbfchar(.*?)endbfchar", source, re.S):
        for left, right in re.findall(rb"<([\dA-Fa-f]+)>\s*<([\dA-Fa-f]+)>", block):
            try: mapping[bytes.fromhex(left.decode())] = bytes.fromhex(right.decode()).decode("utf-16-be")
            except (ValueError, UnicodeDecodeError): pass
    for block in re.findall(rb"beginbfrange(.*?)endbfrange", source, re.S):
        for line in block.splitlines():
            match = re.search(rb"<([\dA-Fa-f]+)>\s*<([\dA-Fa-f]+)>\s*<([\dA-Fa-f]+)>", line)
            if not match: continue
            left, right, destination = match.groups()
            try:
                first, last, base, width = int(left, 16), int(right, 16), int(destination, 16), len(bytes.fromhex(left.decode()))
                if last < first or last - first > 65536: continue
                for code in range(first, last + 1): mapping[code.to_bytes(width, "big")] = (base + code - first).to_bytes(len(bytes.fromhex(destination.decode())), "big").decode("utf-16-be")
            except (ValueError, UnicodeDecodeError, OverflowError): pass
    return mapping

def decode_hex(value: bytes, cmap: dict[bytes, str]) -> str:
    raw, output, index = bytes.fromhex(value.decode()), [], 0
    widths = sorted({len(key) for key in cmap}, reverse=True) or [2, 1]
    while index < len(raw):
        for width in widths:
            key = raw[index:index + width]
            if key in cmap: output.append(cmap[key]); index += width; break
        else: index += 1
    return "".join(output)

def page_text(page: bytes, objects: dict[int, bytes], cmap_cache: dict[int, dict[bytes, str]]) -> str:
    fonts = {name.decode(): int(target) for name, target in re.findall(rb"/(F\w+)\s+(\d+)\s+0\s+R", page)}
    contents = re.search(rb"/Contents\s*\[(.*?)\]", page, re.S)
    content_refs = refs(contents.group(1)) if contents else refs((re.search(rb"/Contents\s+(\d+\s+0\s+R)", page) or [b"", b""])[1])
    chunks, current_font = [], ""
    token = re.compile(rb"/(F\w+)\s+[\d.]+\s+Tf|<([\dA-Fa-f]+)>\s*Tj|\[(.*?)\]\s*TJ", re.S)
    for target in content_refs:
        for match in token.finditer(decode_stream(objects[target])):
            if match.group(1): current_font = match.group(1).decode(); continue
            font_ref = fonts.get(current_font)
            if font_ref and font_ref not in cmap_cache: cmap_cache[font_ref] = build_cmap(objects[font_ref], objects)
            cmap = cmap_cache.get(font_ref, {})
            values = [match.group(2)] if match.group(2) else re.findall(rb"<([\dA-Fa-f]+)>", match.group(3))
            chunks.extend(decode_hex(value, cmap) for value in values)
    return " ".join(filter(None, chunks))

def parse_rows(text: str) -> list[dict]:
    sections = text.split("Word Meaning")
    if len(sections) < 3: return []
    word_matches = re.findall(r"(\d+)\s+([A-Za-z][A-Za-z'-]*(?:\s+[A-Za-z][A-Za-z'-]*)?)", sections[1])
    meaning_text = sections[2].split("GRE 词汇精选")[0]
    boundaries = list(re.finditer(r"(?<!\d)(\d+)\s+", meaning_text))
    meanings = {}
    for index, match in enumerate(boundaries):
        end = boundaries[index + 1].start() if index + 1 < len(boundaries) else len(meaning_text)
        meanings[int(match.group(1))] = re.sub(r"\s+", " ", meaning_text[match.end():end]).strip()
    rows = []
    for number, word in word_matches:
        raw = meanings.get(int(number), "")
        pos = " ".join(dict.fromkeys(re.findall(r"\b(?:adj|adv|n|v|vi|vt|prep|conj|pron|num|aux)\.", raw)))
        chinese = unicodedata.normalize("NFKC", re.sub(r"^(?:(?:adj|adv|n|v|vi|vt|prep|conj|pron|num|aux)\.\s*)+", "", raw).strip())
        rows.append({"id": int(number), "word": word.strip().lower(), "phonetic": "", "partOfSpeech": pos, "chineseMeaning": chinese, "englishMeaning": "", "synonyms": [], "example": "", "root": "", "wordFamily": []})
    return rows

def main():
    parser = argparse.ArgumentParser(); parser.add_argument("pdf", type=Path); parser.add_argument("output", type=Path); args = parser.parse_args()
    objects = unpack_objects(args.pdf.read_bytes())
    catalog = next(obj for obj in objects.values() if b"/Type /Catalog" in obj)
    pages_root = int(re.search(rb"/Pages\s+(\d+)\s+0\s+R", catalog).group(1))
    declared_pages = int(re.search(rb"/Count\s+(\d+)", objects[pages_root]).group(1))
    pages = page_order(objects, pages_root); rows, failed, cmap_cache = [], [], {}
    for page_number, page_ref in enumerate(pages, 1):
        parsed = parse_rows(page_text(objects[page_ref], objects, cmap_cache))
        if not parsed: failed.append(page_number)
        rows.extend(parsed)
    counts = {}; [counts.__setitem__(row["word"], counts.get(row["word"], 0) + 1) for row in rows]
    duplicates = sum(count - 1 for count in counts.values() if count > 1)
    unique, seen = [], set()
    for row in sorted(rows, key=lambda item: item["id"]):
        if row["word"] not in seen and row["word"]: unique.append(row); seen.add(row["word"])
    payload = {"metadata": {"source": args.pdf.name, "pdfPages": declared_pages, "parsedPages": len(pages), "rawEntries": len(rows), "cleanEntries": len(unique), "uniqueWords": len(seen), "duplicates": duplicates, "blankOrInvalid": sum(not row["word"] or not row["chineseMeaning"] for row in rows), "unparsedPages": failed}, "words": unique}
    args.output.parent.mkdir(parents=True, exist_ok=True); args.output.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(json.dumps(payload["metadata"], ensure_ascii=False, indent=2))
if __name__ == "__main__": main()
