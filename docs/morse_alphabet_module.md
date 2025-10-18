# Morse Code Alphabet 模块设计文档

## 模块概述
“Morse Code Alphabet” 模块用于展示摩斯电码的完整字母、数字及常见符号对照表，帮助用户快速学习和查阅。  
该模块可作为独立页面，也可嵌入主站首页或 Translator 模块旁边，提升学习体验。

---

## 模块目标
- 提供完整的摩斯电码字母、数字、符号表。
- 支持用户通过点击字母或符号播放摩斯电码声音。
- 提供下载和打印功能，方便学习使用。
- 可用于SEO优化关键词 “Morse Code Alphabet”、“Morse Code Chart”、“Learn Morse Code”。

---

## 内容结构

### 1. 字母表部分
| 字母 | 摩斯电码 | 发音 (点=dot, 划=dash) |
|------|-----------|----------------------|
| A | .- | dot dash |
| B | -... | dash dot dot dot |
| C | -.-. | dash dot dash dot |
| D | -.. | dash dot dot |
| E | . | dot |
| F | ..-. | dot dot dash dot |
| G | --. | dash dash dot |
| H | .... | dot dot dot dot |
| I | .. | dot dot |
| J | .--- | dot dash dash dash |
| K | -.- | dash dot dash |
| L | .-.. | dot dash dot dot |
| M | -- | dash dash |
| N | -. | dash dot |
| O | --- | dash dash dash |
| P | .--. | dot dash dash dot |
| Q | --.- | dash dash dot dash |
| R | .-. | dot dash dot |
| S | ... | dot dot dot |
| T | - | dash |
| U | ..- | dot dot dash |
| V | ...- | dot dot dot dash |
| W | .-- | dot dash dash |
| X | -..- | dash dot dot dash |
| Y | -.-- | dash dot dash dash |
| Z | --.. | dash dash dot dot |

### 2. 数字表部分
| 数字 | 摩斯电码 |
|------|-----------|
| 0 | ----- |
| 1 | .---- |
| 2 | ..--- |
| 3 | ...-- |
| 4 | ....- |
| 5 | ..... |
| 6 | -.... |
| 7 | --... |
| 8 | ---.. |
| 9 | ----. |

### 3. 常见符号表
| 符号 | 摩斯电码 |
|------|-----------|
| . (句号) | .-.-.- |
| , (逗号) | --..-- |
| ? (问号) | ..--.. |
| ! (感叹号) | -.-.-- |
| / (斜杠) | -..-. |
| @ (at符号) | .--.-. |
| : (冒号) | ---... |
| ' (单引号) | .----. |
| - (短横线) | -....- |
| ( (左括号) | -.--. |
| ) (右括号) | -.--.- |

---

## 功能设计

### 🔹 交互功能
- 点击任意字母/数字/符号 → 播放摩斯电码声音。
- 支持 “复制” 电码到剪贴板。
- 支持搜索（输入 A 自动高亮 “A .-”）。

### 🔹 导出功能
- 下载为 PDF 或 PNG。
- 打印友好版（简洁表格布局）。

### 🔹 SEO 建议
- 页面标题：`Morse Code Alphabet | Full Morse Code Chart`
- 页面描述：`Learn the full Morse Code alphabet with letters, numbers, and symbols. Interactive chart with sound and easy copy feature.`
- H1：`Morse Code Alphabet`
- H2：`Letters, Numbers, and Symbols in Morse Code`
- H3：`Learn Morse Code Easily`

---

## 技术实现建议
- 使用 React + Tailwind CSS 渲染表格。
- 可选添加音频播放逻辑（Tone.js 或 Web Audio API）。
- 数据结构建议使用 JSON 存储字母与代码映射。

---

## 扩展计划
- 增加 “学习模式”：逐个练习摩斯字母。
- 增加 “听力模式”：播放摩斯电码，用户猜测对应字母。
- 增加多语言支持（英文 / 中文 / 西班牙文）。
