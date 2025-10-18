# Morse Code 网站设计文档

## 一、网站结构图（Site Map）

```
Home
│
├── Translator（摩斯电码翻译器）
│   ├── 文字 → 摩斯电码
│   ├── 摩斯电码 → 文字
│   ├── 音频播放
│   └── 复制 & 分享
│
├── Chart（字母与数字表）
│   ├── 字母 A-Z
│   ├── 数字 0-9
│   ├── 常用符号
│   └── 下载/音频播放
│
├── Learn & Practice（学习与练习）
│   ├── 教程模块（入门 → 高级）
│   ├── 练习游戏（闯关/限时/自定义）
│   └── 成就与积分
│
├── Applications & Fun（应用与趣味）
│   ├── SOS 信号演示
│   ├── 灯光/手电信号演示
│   └── 摩斯谜题 & 趣味小游戏
│
└── About & Resources（关于 & 资源）
    ├── 网站介绍
    ├── 摩斯电码资料下载
    ├── 外部学习资源
    └── FAQ
```

---

## 二、页面模块布局示意

### 首页（Home）
```
[Header] 网站LOGO + 导航栏(Home/Translator/Chart/…)
[Hero Section] 大标题 + 简短介绍 + 快速入口按钮
[Feature Highlights] 翻译器 / 学习 / 游戏 / 资源
[Latest Articles/News] 摩斯电码趣闻 / 历史
[Footer] 联系方式 / 版权 / 社交链接
```

### 翻译器页面（Translator）
```
[Header]
[Translator Section]
    [输入框] 文字或摩斯电码
    [输出框] 转换结果
    [转换按钮] / [复制按钮] / [分享按钮]
    [音频播放按钮]
[Footer]
```

### 字母与数字表（Chart）
```
[Header]
[Alphabet Chart] A-Z
[Number Chart] 0-9
[Symbol Chart] 常用符号
[互动功能] 点击播放点划音 / 下载 PDF
[Footer]
```

### 学习与练习（Learn & Practice）
```
[Header]
[Tutorial Modules] 入门 → 高级
[Practice Games] 闯关 / 限时 / 自定义
[Achievements & Scores] 用户积分与等级
[Footer]
```

### 应用与趣味（Applications & Fun）
```
[Header]
[SOS Signal Demo]
[Flashlight / Light Signal Demo]
[Morse Puzzles / Fun Games]
[Footer]
```

### 关于 & 资源（About & Resources）
```
[Header]
[About Us]
[Downloadable Resources]
[External Learning Links]
[FAQ]
[Footer]
```