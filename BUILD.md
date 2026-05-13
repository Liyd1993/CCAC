# SimpleApp - Android 构建说明

## 云端构建 APK (GitHub Actions)

### 步骤

1. **初始化 Git 仓库**（如果还没有）
   ```bash
   cd /Users/liyd/my-todo/apps/simple-app
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **创建 GitHub 仓库**
   - 访问 https://github.com/new
   - 创建一个新仓库（私有或公开）

3. **推送代码**
   ```bash
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git branch -M main
   git push -u origin main
   ```

4. **触发构建**
   - 推送后，GitHub Actions 会自动运行
   - 或者在 GitHub 仓库页面点击 **Actions** → 选择工作流 → **Run workflow**

5. **下载 APK**
   - 构建完成后，在 **Actions** 页面
   - 点击最新的构建 → 滚动到页面底部
   - 点击 `app-debug.apk` 下载

---

## 本地构建（如果有 Android Studio）

```bash
cd apps/simple-app
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

APK 位置：`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 安装到手机

1. 下载 `app-debug.apk` 到手机
2. 在手机上安装（需要允许"未知来源"）
3. 或者通过 ADB:
   ```bash
   adb install app-debug.apk
   ```

---

## 配置环境变量

**重要**：在生产构建前，需要在 GitHub 仓库添加 Secrets：

1. 在 GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions**
2. 添加以下 Secrets：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

然后更新 `.github/workflows/build-apk.yml` 使用这些变量。

---

## 发布正式版

发布正式版需要签名证书：

```bash
# 生成签名密钥
keytool -genkey -v -keystore my-release-key.keystore -alias my-alias -keyalg RSA -keysize 2048 -validity 10000

# 在 android/gradle.properties 配置签名
# 在 android/app/build.gradle 配置 release 签名
```
