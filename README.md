# 简单内容记录应用

一个基于 Supabase + React 的简单内容记录应用，用于熟悉 Supabase 开发流程。

## 功能

- ✅ 邮箱密码登录/注册
- ✅ 输入并保存内容
- ✅ 查看历史记录
- ✅ 删除自己的内容

## 快速开始

### 1. 创建 Supabase 项目

1. 访问 https://supabase.com
2. 点击 "New Project"
3. 项目名称：`Test`
4. 数据库密码：`ClaudeCode123!`

### 2. 执行数据库初始化 SQL

1. 进入项目后台
2. 点击左侧 **SQL Editor**
3. 点击 **New query**
4. 复制 `supabase-schema.sql` 的内容并执行

### 3. 获取项目配置

1. 进入 **Settings** → **API**
2. 复制以下两个值：
   - `Project URL`
   - `anon public` key

### 4. 配置环境变量

```bash
cd apps/simple-app
cp .env.local.example .env.local
```

编辑 `.env.local`：

```
VITE_SUPABASE_URL=你的 Project URL
VITE_SUPABASE_ANON_KEY=你的 anon key
```

### 5. 安装依赖并运行

```bash
npm install
npm run dev
```

访问 http://localhost:5173

## 文件结构

```
apps/simple-app/
├── src/
│   ├── components/
│   │   ├── LoginForm.tsx    # 登录/注册表单
│   │   ├── ContentForm.tsx  # 内容输入表单
│   │   └── ContentList.tsx  # 历史记录列表
│   ├── lib/
│   │   └── supabase.ts      # Supabase 客户端
│   ├── App.tsx              # 主应用组件
│   ├── main.tsx             # 入口文件
│   └── index.css            # 全局样式
├── supabase-schema.sql      # 数据库初始化脚本
├── .env.local.example       # 环境变量示例
└── package.json
```

## 下一步

- [ ] 添加微信登录
- [ ] 添加内容编辑功能
- [ ] 添加搜索/过滤
