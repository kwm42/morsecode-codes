# Morse Code Translator 模块设计文档

## 一、功能总览

| 功能分类 | 功能说明 | 用户交互 | 技术要点 |
|-----------|-----------|-----------|-----------|
| **1. Text → Morse Translator** | 将用户输入的文字转换为摩斯电码 | 用户输入文字后，实时显示摩斯结果 | 字母映射表、空格处理、节奏符号转换（· —） |
| **2. Morse → Text Translator** | 将摩斯电码转换为英文文字 | 支持空格与斜杠分隔格式（如 `.... . .-.. .-.. --- / .-- --- .-. .-.. -..`） | 自动识别输入模式（文本或摩斯） |
| **3. Auto Detect Mode** | 自动识别输入是 Morse 还是普通文本 | 用户直接粘贴输入，无需手动选择模式 | 模式检测算法（正则判断点线比例） |
| **4. Copy & Share** | 一键复制翻译结果或分享链接 | 按钮操作 | 使用 Clipboard API + 短链接生成 |
| **5. Audio Playback** | 将翻译的摩斯电码转为声音播放 | 点击播放按钮 | Web Audio API 生成高低频率音波 |
| **6. Light Signal / Flash Demo** | 使用闪光灯展示摩斯信号 | 手机或桌面灯光演示 | CSS Animation / WebRTC 摄像头灯光控制（可选） |
| **7. Speed & Tone Control** | 控制音频速度（WPM）和音调 | 滑块调整速度与频率 | 实时参数调整（duration, frequency） |
| **8. Save as Audio (MP3/WAV)** | 导出生成的 Morse Code 声音 | 点击“下载音频”按钮 | Web Audio API + Blob 导出 |
| **9. Clear / Reset Input** | 一键清除输入框 | 按钮操作 | 清空输入状态 |
| **10. History / Recent Translations** | 显示最近翻译的记录 | 自动保存5-10条记录 | localStorage 持久化 |

---

## 二、UI/UX 设计建议

| 模块位置 | 元素 | 说明 |
|-----------|-------|------|
| **顶部区域** | Title + 简短说明 | “Morse Code Translator – Convert Text & Audio Online” |
| **主输入区** | Textarea 输入框 × 2 | 左侧为文字输入，右侧为摩斯输出（双向） |
| **模式切换区** | Toggle 按钮 | Text ↔ Morse |
| **操作区** | Translate, Copy, Play, Download 按钮 | 图标+文字提示 |
| **控制区** | 音调与速度滑块 | WPM（Words per minute）、Frequency（Hz） |
| **底部扩展区** | Recent Translations / Share | 历史记录和社交分享按钮 |

---

## 三、进阶功能（可选增强）

| 功能 | 描述 |
|------|------|
| 🔊 **Real-time Morse Input via Keyboard** | 用户按键时间间隔识别点/划（模拟电报机输入） |
| 🧠 **AI Assisted Decoder** | 自动容错：根据部分输入推测最可能的字母 |
| 🌐 **Multilingual Morse Support** | 支持拉丁、俄语、日语等摩斯扩展表 |
| 📱 **PWA 支持** | 可离线使用（安装到手机主屏） |
| 🎛️ **Accessibility Support** | 语音提示 + 键盘操作兼容（WCAG 标准） |

---

## 四、SEO & 内容优化建议

| 元素 | 内容示例 |
|------|-----------|
| **Page Title (H1)** | Morse Code Translator – Text to Morse & Morse to Text Converter |
| **Meta Description** | Convert text to Morse Code or decode Morse messages instantly. Includes audio playback, speed control, and Morse alphabet chart. |
| **URL** | `/translator` |
| **Keywords** | Morse Code Translator, Morse Code Converter, Text to Morse, Morse to Text, Morse Audio |
