// server/api/tasks/index.get.js
import { getUserFromToken } from '../auth/utils';
import { getDatabase } from '../../database';

// 获取所有任务
export default defineEventHandler(async (event) => {
  // 获取用户信息
  const user = getUserFromToken(event);
  if (!user) {
    setResponseStatus(event, 401);
    return { error: '未授权访问' };
  }
  
  // 获取数据库连接
  const db = await getDatabase();
  
  // 只返回当前用户的任务
  const tasks = await db.all(
    'SELECT id, title, completed, image, user_id as userId FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
    user.userId
  );
  
  return tasks;
});