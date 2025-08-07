# Nuxt3 任务管理应用

一个基于 Nuxt 3 和 Vue 3 的全栈任务管理应用，具有用户认证、任务管理和图片上传功能。

## 功能特性

- 用户注册和登录
- 任务创建、查看、更新和删除
- 为任务上传图片并预览
- 响应式设计，支持移动端和桌面端
- 数据持久化存储（SQLite 数据库）

## 技术栈

- [Nuxt 3](https://nuxt.com/) - Vue.js 框架
- [Vue 3](https://vuejs.org/) - 前端框架
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- SQLite - 数据库
- JavaScript - 主要编程语言

## 环境要求

- Node.js 版本 18 或更高版本
- npm, yarn, pnpm 或 bun 包管理器

## 快速开始

### 安装依赖

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install

```

### 项目结构

nuxt-todo-app/
├── assets/              # 静态资源
├── composables/         # 可组合函数
├── layouts/             # 布局组件
├── middleware/          # 路由中间件
├── pages/               # 页面组件
├── public/              # 静态文件
├── server/              # 服务端 API
│   ├── api/             # API 路由
│   └── database.js      # 数据库访问层
└── ...

## 数据库

项目使用 SQLite 作为数据库，数据文件存储在 server/database.sqlite。应用启动时会自动初始化数据库并创建必要的表结构。

## 表结构
1. users: 用户表
   - id: 主键，自动递增
   - username: 用户名，唯一
   - password: 密码（实际应用中应使用哈希存储）
   - created_at: 创建时间

2. tasks: 任务表
   - id: 主键，自动递增
   - title: 任务标题
   - completed: 完成状态，0或1
   - user_id: 外键，引用users表的id
   - created_at: 创建时间

## API接口

### 认证相关

1. POST /api/register: 注册新用户
2. POST /api/login: 用户登录

### 任务相关
1. GET /api/tasks: 获取所有任务
2. POST /api/tasks: 创建新任务
3. GET /api/tasks/:id: 获取指定任务详情
4. PUT /api/tasks/:id: 更新指定任务
5. DELETE /api/tasks/:id: 删除指定任务
6. POST /api/tasks/:id/upload: 上传任务图片

## 开发说明

- 项目使用基于文件系统的路由系统
- 认证通过 JWT token 实现（简化版）
- 图片上传后存储在 public/uploads/ 目录
- 使用 localStorage 存储用户认证信息
- 响应式设计基于 Tailwind CSS 实现

## 注意事项

- 密码存储使用明文形式（仅用于演示，生产环境应使用加密）
- JWT token 为简化实现（生产环境应使用标准 JWT 库）
- 图片上传大小限制为 5MB

## 许可证

本项目仅供学习和参考使用。
