# SFT Brain iOS - 精简版设置指南

这是一个精简的 sft-brain-ios 项目压缩包，只包含运行 mobile web 和 iOS Capacitor 应用所需的核心代码。

## 📦 压缩包内容

**包含：**
- ✅ 源代码（app/、components/、lib/、hooks/等）
- ✅ iOS Capacitor 配置和原生项目（ios/）
- ✅ 配置文件（package.json、capacitor.config.ts、tsconfig.json等）
- ✅ 文档（README.md、RUN_iOS.md、CAPACITOR_GUIDE.md等）

**排除（需要安装/构建）：**
- ❌ node_modules（601MB）- 通过 npm install 恢复
- ❌ .next（构建缓存）- 自动生成
- ❌ out（构建产物）- 通过 npm run build 生成
- ❌ .git（版本历史）- 不需要
- ❌ iOS Pods（如有）- 通过 pod install 恢复

**压缩包大小：** ~801KB（原项目约 606MB）

## 🚀 快速开始

### 1. 解压文件
```bash
tar -xzf sft-brain-ios-minimal.tar.gz
cd sft-brain-ios
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local 配置后端API地址
# NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### 4. 运行 Mobile Web（开发模式）
```bash
npm run dev
# 访问 http://localhost:3000
```

### 5. 构建并运行 iOS App

#### 构建静态文件
```bash
npm run build
```

#### 同步到 iOS 项目
```bash
npx cap sync ios
```

#### 在 Xcode 中打开并运行
```bash
npx cap open ios
```

然后在 Xcode 中选择模拟器或真机，点击运行按钮。

## 📱 iOS 应用说明

### Safe Area 处理
项目使用 **手动 CSS 控制** 方式处理 iOS 安全区域：

```typescript
// capacitor.config.ts
ios: {
  contentInset: 'never', // 禁用自动safe area，使用CSS手动控制
}
```

底部导航组件会自动添加 `safe-area-inset-bottom` 适配 iPhone 的刘海和 Home Indicator。

### 滚动修复
- 所有布局使用 `min-h-screen` 和 `100dvh` 而非 `position: fixed`
- 确保 iOS WebView 可以正常滚动

## 📚 详细文档

解压后查看以下文档：
- `README.md` - 项目总览和中文说明
- `RUN_iOS.md` - iOS 运行详细步骤
- `CAPACITOR_GUIDE.md` - Capacitor 集成指南
- `BACKEND_INTEGRATION.md` - 后端集成说明

## 🔧 常用命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 同步 Capacitor
npx cap sync

# 打开 iOS 项目
npx cap open ios

# 运行 iOS（需要先 build 和 sync）
npx cap run ios
```

## ⚠️ 注意事项

1. **依赖安装：** 首次使用必须运行 `npm install`
2. **iOS 开发：** 需要 macOS 和 Xcode
3. **后端连接：** 确保后端 API 服务已启动并配置正确的 URL
4. **环境变量：** 根据实际情况修改 `.env.local`

## 🐛 常见问题

### Q: npm install 失败
A: 检查 Node.js 版本（建议 v18+），清除缓存：`npm cache clean --force`

### Q: iOS 构建失败
A:
1. 确保已安装 Xcode Command Line Tools
2. 运行 `npx cap sync ios`
3. 在 Xcode 中清理项目：Product > Clean Build Folder

### Q: 内容被 Dynamic Island 遮挡
A: 检查 `capacitor.config.ts` 中 `contentInset: 'never'` 配置是否正确

## 📞 获取帮助

遇到问题？查看项目文档或检查：
- Capacitor 官方文档：https://capacitorjs.com
- Next.js 官方文档：https://nextjs.org

---

生成时间：2026-01-10
原始项目大小：~606MB
精简后大小：~801KB
压缩比：99.87%
