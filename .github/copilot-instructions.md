# GitHub Construction

## 项目概览
- 名称：Next.js Framework Starter（Cloudflare Workers 部署版本）
- 技术栈：Next.js 14（App Router）、TypeScript、PostCSS、ESLint、OpenNext Cloudflare Adapter
- 运行目标：构建静态资源并通过 Cloudflare Workers 提供服务

## 通用
- 始终使用中文回答用户，代码注释也要使用中文
- 这是一个使用 App Router 的 Next.js TypeScript 应用。
- 使用 React 开发组件，优先使用函数式组件。
- 使用 Tailwind CSS 进行样式设计。
- 整体风格明亮，简洁。
- 使用 Shadcn UI 组件，主题样式在 src/app/theme.css 中定义，所有组件和页面要根据theme主题进行配色。
- 使用 React Context 进行状态管理。
- 组件名称使用 CamelCase 命名。
- 使用 next-intl 进行国际化。

## 文件结构

- src/app/：Next.js App Router 页面和 API 路由
  - [locale]/：特定语言页面
  - api/：API 路由（如 checkout）
  - theme.css：主题样式
- src/components/：React 组件
  - blocks/：布局模块（header, footer 等），常用于着陆页
  - ui/：可复用的 UI 组件
- src/contexts/：React 上下文（如 app context）
- src/i18n/：国际化
  - pages/landing/：着陆页的页面级翻译
  - messages/：全局通用消息
- src/types/：TypeScript 类型定义
  - blocks/：布局模块类型
  - pages/：页面类型
- src/models/：数据模型与数据操作。
- src/services/：业务逻辑。
- src/lib/：自定义库与函数
- public/：静态资源
- .env.development：开发环境变量

## 编码规范

- 使用 TypeScript 保证类型安全
- 遵循 React 最佳实践与 Hooks 模式
- 使用 Tailwind CSS 和 Shadcn UI 实现响应式设计
- 保持一致的国际化结构
- 保持组件模块化与可复用
- 为组件与数据使用合适的类型定义
