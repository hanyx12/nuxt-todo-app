// 导入数据库模块
import { requireUser } from '../auth/utils';
import { getDatabase } from '../../database';

// 创建新任务
export default defineEventHandler(async (event) => {
  // 验证用户身份
  const user = requireUser(event);
  if (user.error) {
    return user; // 返回错误信息
  }
  
  // 获取请求体数据
  const body = await readBody(event);
  
  if (!body.title || !body.title.trim()) {
    setResponseStatus(event, 400);
    return { error: '任务标题不能为空' };
  }
  
  // 获取数据库连接
  const db = await getDatabase();
  
  // 创建新任务
  const result = await db.run(
    'INSERT INTO tasks (title, user_id) VALUES (?, ?)',
    [body.title.trim(), user.userId]
  );
  
  // 获取新创建的任务
  const newTask = await db.get(
    'SELECT id, title, completed, image, user_id as userId FROM tasks WHERE id = ?',
    [result.lastID]
  );
  
  // 返回新创建的任务
  return newTask;
});