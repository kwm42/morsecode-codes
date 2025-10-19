# Morse Code Learn & Practice 模块设计文档

## 模块概述
“Morse Code Learn & Practice” 模块旨在帮助用户学习摩斯电码的基本规则并通过交互练习巩固记忆。  
它结合了教程、听写训练、速度挑战、游戏模式等功能，适合初学者与进阶用户。

---

## 模块目标
- 让用户逐步掌握摩斯电码的字母、数字及符号。
- 通过音频/视觉反馈强化学习效果。
- 提供练习与游戏化体验，增加用户黏性。
- 适配移动端、桌面端友好操作。

---

## 内容结构

### 1️⃣ 学习部分（Learn）
提供分阶段的教学内容：

| 阶段 | 内容 | 功能 |
|------|------|------|
| 基础阶段 | 什么是摩斯电码（历史、原理） | 动画演示“点(dot)”和“划(dash)” |
| 字母阶段 | A–Z 的摩斯编码 | 单个字母发音+电码音 |
| 数字阶段 | 0–9 的摩斯编码 | 数字输入练习 |
| 符号阶段 | 常见标点符号 | 介绍拓展符号电码 |
| 节奏与规则 | 字母间隔、单词间隔规则 | 可视化“节奏节拍”展示 |

💡 增强功能：
- “逐个学习”按钮：点击后逐字播放电码+显示字母。
- “播放全部”功能：循环播放整组字符，便于记忆。

---

### 2️⃣ 练习部分（Practice）

| 类型 | 描述 | 难度 |
|------|------|------|
| 听码识字（Audio to Text） | 听摩斯音频 → 输入对应字母 | ⭐ 初级 |
| 看码识字（Visual to Text） | 看闪光或点划动画 → 输入字母 | ⭐⭐ 中级 |
| 打码练习（Text to Morse） | 输入字母 → 输出摩斯编码 | ⭐ 中级 |
| 听写模式（Dictation Mode） | 听句子电码 → 输入完整单词 | ⭐⭐⭐ 高级 |
| 限时挑战（Speed Challenge） | 在限定时间内答对尽可能多字符 | ⭐⭐⭐⭐ 高级 |
| 随机练习（Shuffle Mode） | 随机字符播放，提高反应速度 | ⭐⭐ 中级 |

---

### 3️⃣ 游戏化模式（Gamified Mode）

- 🕹️ Morse Speed Typing Game：用户在限定时间内解码摩斯信号，显示得分与排名。
- 🎯 Accuracy Challenge：听10个信号，答对率 >80% 才能解锁下一关。
- 🧩 Pattern Puzzle：给出摩斯电码拼图，用户拖动组成正确字母序列。

---

### 4️⃣ 成就系统（Progress & Rewards）

| 类型 | 触发条件 | 奖励 |
|------|-----------|------|
| 初级学者 | 学完A–Z | 勋章“Learner” |
| 摩斯高手 | 听码正确率达90% | 勋章“Expert” |
| 极速译员 | 速度挑战破纪录 | 勋章“Speedster” |

用户可查看：
- 学习进度条（%）
- 历史成绩记录
- 每周挑战任务

---

### 5️⃣ 技术实现建议

| 功能 | 实现建议 |
|------|-----------|
| 音频播放 | 使用 Web Audio API 或 Tone.js 生成摩斯音 |
| 动画可视化 | 使用 CSS 动画或 Canvas 模拟闪光 |
| 数据存储 | 使用 LocalStorage 保存用户进度 |
| 响应式设计 | Tailwind CSS / Next.js App Router |
| 分析统计 | 可与 Plausible 或自建统计集成 |

---

### 6️⃣ SEO 优化建议

| 元素 | 内容 |
|------|------|
| 页面标题 | Learn and Practice Morse Code Online | Interactive Morse Trainer |
| 描述 | Learn Morse Code online through interactive lessons and practice exercises. Play audio, type signals, and test your speed with fun challenges. |
| H1 | Morse Code Learn and Practice |
| H2 | Learn Morse Code Step by Step |
| H3 | Practice with Audio and Visual Exercises |

---

### 7️⃣ 扩展功能计划
- 支持夜间模式 / 低亮度视觉训练。
- 增加每日一练功能。
- 增加社交排行榜和挑战好友。
- 集成 PWA，支持离线练习。
