# SFT Brain iOS

SFT Brain 独立移动端网页应用，支持使用 Capacitor 转换为 iOS 原生应用。该应用使用模拟数据完全独立运行，后续可轻松连接到后端 API。

## 功能特性

- 📱 **移动优先设计**：专为移动设备优化，具有原生 iOS 体验
- 🔐 **双重认证**：支持邮箱/密码登录 + Google OAuth
- 📦 **模拟数据**：内置 50+ 条真实的问答对用于测试
- 🎯 **间隔重复**：智能复习计划算法
- 📊 **进度追踪**：可视化分析和活动热力图
- 🏷️ **标签和搜索**：轻松组织和查找问答对
- 📝 **富文本内容**：支持 Markdown 和代码语法高亮
- 📱 **iOS 就绪**：已配置 Capacitor iOS 构建

## 快速开始

### 环境要求

- Node.js 18+ 和 npm
- Git

### 安装步骤

```bash
# 克隆或进入项目目录
cd sft-brain-ios

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

应用将在 http://localhost:3001 上运行

### 演示账号

使用以下账号登录（所有账号密码均为 `password123`）：
- user@example.com
- demo@example.com
- member1@example.com

## 项目结构

```
sft-brain-ios/
├── app/                    # Next.js 应用目录
│   ├── (auth)/            # 受保护的路由（仪表盘、问答等）
│   ├── login/             # 登录页面（邮箱/密码 + OAuth）
│   ├── layout.tsx         # 根布局
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── mobile/            # 移动端专用组件
│   └── ui/                # shadcn/ui 组件
├── lib/                   # 工具函数和业务逻辑
│   ├── mock/              # 模拟数据和 API
│   │   ├── data.ts        # 50+ 条模拟问答对
│   │   └── api.ts         # 模拟 API 服务
│   ├── api-client.ts      # API 客户端（支持模拟模式）
│   ├── types.ts           # TypeScript 类型定义
│   └── mobile/            # 移动端专用工具
├── public/                # 静态资源
├── capacitor.config.ts    # Capacitor 配置
├── .env.local             # 环境变量
└── package.json           # 依赖配置
```

## 可用脚本命令

```bash
# 开发
npm run dev              # 在端口 3001 启动开发服务器

# 构建
npm run build            # 生产环境构建
npm run build:mobile     # 为 Capacitor 构建（静态导出）

# Capacitor
npm run sync:ios         # 构建并同步到 iOS
npm run sync:android     # 构建并同步到 Android
npm run open:ios         # 打开 Xcode
npm run open:android     # 打开 Android Studio
```

## 独立运行（模拟模式）

应用默认使用模拟数据独立运行：

1. **模拟数据**：50+ 条真实的问答对，涵盖编程、算法、系统设计等
2. **模拟认证**：使用演示账号进行邮箱/密码登录
3. **本地存储**：所有更改保存到浏览器 localStorage
4. **无需后端**：无需任何服务器即可完整运行

### 模拟 API 功能

所有后端功能均已模拟：
- ✅ 用户认证和会话管理
- ✅ 问答对的增删改查操作
- ✅ 间隔重复算法
- ✅ 标签和搜索功能
- ✅ 仪表盘统计数据
- ✅ 复习历史记录

## 环境配置

编辑 `.env.local` 文件来配置应用：

```bash
# 使用模拟数据（true = 独立模式，false = 连接后端）
NEXT_PUBLIC_USE_MOCK_DATA=true

# 后端 API 地址（仅在模拟模式为 false 时使用）
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## 转换为 iOS 应用

查看 [CAPACITOR_GUIDE.md](./CAPACITOR_GUIDE.md) 获取详细说明：
- 设置 iOS 开发环境
- 构建 iOS 应用
- 在模拟器和真机上测试
- 准备提交到 App Store

## 连接后端 API

查看 [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) 获取说明：
- 从模拟模式切换到真实 API
- 配置环境变量
- API 端点文档
- 认证流程

## 技术栈

- **框架**：Next.js 16（App Router）
- **语言**：TypeScript
- **UI**：Tailwind CSS + shadcn/ui
- **移动端**：Capacitor 8
- **状态管理**：React Query（TanStack Query）
- **表单**：React Hook Form + Zod 验证

## 开发说明

### 热重载
开发期间，文件更改会自动在浏览器中重新加载。

### 模拟数据持久化
- 每次页面刷新时重新加载模拟数据
- 用户创建的问答对保存到 localStorage
- 登录状态在会话间保持

### 移动端测试
在移动设备上访问您的电脑 IP 地址来测试应用：
```bash
# 查找您的 IP 地址
ifconfig  # macOS/Linux
ipconfig  # Windows

# 然后访问：http://您的IP:3001
```

## 常见问题

### 端口被占用
如果端口 3001 被占用，编辑 `package.json` 使用其他端口：
```json
"dev": "next dev -p 3002"
```

### 依赖安装失败
```bash
# 清除 npm 缓存并重试
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### 构建错误
```bash
# 确保 TypeScript 类型正确
npm run build

# 检查控制台中的错误信息
```

## 贡献

这是 SFT Brain 移动端网页的独立版本。完整项目请参考父仓库。

## 许可证

SFT Brain 项目的一部分。
