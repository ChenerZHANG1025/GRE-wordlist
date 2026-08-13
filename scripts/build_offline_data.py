#!/usr/bin/env python3
"""Build the file:// compatible JavaScript dataset from data/words.json."""

from pathlib import Path


SOURCE = Path("data/words.json")
TARGET = Path("data/words.js")


def main() -> None:
    payload = SOURCE.read_text(encoding="utf-8")
    TARGET.write_text(f"window.VOCABLOOM_WORDS = {payload};\n", encoding="utf-8")
    print(f"Wrote {TARGET} from {SOURCE}")


if __name__ == "__main__":
    main()
