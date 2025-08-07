// server/api/auth/login.post.js
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
  
  // 查找用户
  const user = await db.get(
    'SELECT id, username, password FROM users WHERE username = ? AND password = ?',
    [username, password]
  );
  
  if (!user) {
    // 调试信息：查看所有用户
    console.log('用户查询失败，当前所有用户:');
    const allUsers = await db.all('SELECT id, username, password FROM users');
    console.log(allUsers);
    
    setResponseStatus(event, 401);
    return { error: '用户名或密码错误' };
  }
  
  // 生成JWT token（简化版）
  const token = btoa(JSON.stringify({ 
    userId: user.id, 
    username: user.username,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24小时过期
  }));
  
  return {
    user: {
      id: user.id,
      username: user.username
    },
    token
  };
});