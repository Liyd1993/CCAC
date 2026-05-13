-- ========================================
-- Simple App - Supabase Database Setup
-- ========================================

-- 1. 创建用户内容表
CREATE TABLE IF NOT EXISTS user_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建索引（加速查询）
CREATE INDEX IF NOT EXISTS idx_user_entries_user_id
ON user_entries(user_id);

CREATE INDEX IF NOT EXISTS idx_user_entries_created_at
ON user_entries(created_at DESC);

-- 3. 启用行级权限 (RLS)
ALTER TABLE user_entries ENABLE ROW LEVEL SECURITY;

-- 4. 创建 RLS 策略
-- 用户只能查看自己的数据
DROP POLICY IF EXISTS "Users can view own entries" ON user_entries;
CREATE POLICY "Users can view own entries"
ON user_entries FOR SELECT
USING (auth.uid() = user_id);

-- 用户只能插入自己的数据
DROP POLICY IF EXISTS "Users can insert own entries" ON user_entries;
CREATE POLICY "Users can insert own entries"
ON user_entries FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 用户只能删除自己的数据
DROP POLICY IF EXISTS "Users can delete own entries" ON user_entries;
CREATE POLICY "Users can delete own entries"
ON user_entries FOR DELETE
USING (auth.uid() = user_id);

-- 5. 创建 trigger 自动填充 user_id
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_user_entries_user_id ON user_entries;
CREATE TRIGGER set_user_entries_user_id
  BEFORE INSERT ON user_entries
  FOR EACH ROW
  EXECUTE FUNCTION set_user_id();

-- 6. 允许匿名用户注册（首次使用需要）
-- 在 Supabase Dashboard -> Authentication -> Settings -> Email Auth
-- 确保 "Enable Email Signup" 是开启状态
