// server/api/auth/register.post.js
import { getDatabase } from '../../database';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  const { username, password } = body;
  
  // 验证输入
  if (!username || !password) {
    setResponseStatus(event, 400);
    return { error: '用户名和密码都是必填项' };
  }
  
  // 获取数据库连接
  const db = await getDatabase();
  
  // 检查用户是否已存在
  const existingUser = await db.get('SELECT * FROM users WHERE username = ?', username);
  if (existingUser) {
    setResponseStatus(event, 409);
    return { error: '用户名已存在' };
  }
  
  // 创建新用户（实际项目中需要加密密码）
  const result = await db.run(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    username,
    password // 注意：实际项目中必须加密密码
  );
  
  const newUser = await db.get('SELECT id, username FROM users WHERE id = ?', result.lastID);
  
  // 生成JWT token（简化版，实际项目中应使用正式的JWT库）
  const token = btoa(JSON.stringify({ 
    userId: newUser.id, 
    username: newUser.username,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24小时过期
  }));
  
  return {
    user: {
      id: newUser.id,
      username: newUser.username
    },
    token
  };
});