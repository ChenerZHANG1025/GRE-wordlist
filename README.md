# GRE-wordlist
# Vocabloom · GRE 单词花园

鹅黄色与浅绿色主题的极简 GRE 单词学习网页。`data/words.json` 由本地《GRE 词汇精选（乱序版）（6485词）》PDF 的全部 325 页解析生成，包含 6,485 个唯一词条。PDF 仅提供单词、词性和中文释义，其他不存在的字段保持为空。

学习页与闪卡会按照 A–Z 字母顺序推进，每日目标为 200 词。学习进度、收藏和易错次数会保存在浏览器本地，刷新页面后仍可继续。

同义词页面支持自行新建、编辑和删除组别，也可以在组内自由添加或移除单词；自定义内容保存在浏览器本地。

如需重新解析 PDF：

```bash
python3 scripts/extract_pdf.py GRE-6485-wordlist.pdf data/words.json
```

## 本地运行

```bash
python3 -m http.server 8000
```

打开 `http://localhost:8000` 即可体验。

## 打开方式

推荐通过 `python3 -m http.server 8000` 启动，此时网站读取 `data/words.json`。也可以直接双击 `index.html`：浏览器在 `file://` 模式下禁止 `fetch` 本地 JSON，因此页面会自动改用由同一份 JSON 生成的 `data/words.js` 离线副本。

如果修改了 `data/words.json`，请同步更新离线副本：

```bash
python3 scripts/build_offline_data.py
```
