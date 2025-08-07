// 导入数据库模块
import { requireUser } from '../auth/utils';
import { getDatabase } from '../../database';

// 删除任务
export default defineEventHandler(async (event) => {
  // 验证用户身份
  const user = requireUser(event);
  if (!user.userId) {
    return user; // 返回错误信息
  }
  
  // 获取任务ID
  const { id } = event.context.params;
  const taskId = parseInt(id);
  
  // 获取数据库连接
  const db = await getDatabase();
  
  // 查找任务
  const task = await db.get('SELECT * FROM tasks WHERE id = ?', taskId);
  if (!task) {
    setResponseStatus(event, 404);
    return { error: '任务不存在' };
  }
  
  // 验证任务所有权
  if (task.user_id !== user.userId) {
    setResponseStatus(event, 403);
    return { error: '无权访问此任务' };
  }
  
  // 删除任务
  await db.run('DELETE FROM tasks WHERE id = ?', taskId);
  
  // 返回删除的任务（从原始任务对象构造返回值）
  const deletedTask = {
    id: task.id,
    title: task.title,
    completed: task.completed === 1,
    image: task.image,
    userId: task.user_id
  };
  
  // 返回删除的任务
  return deletedTask;
});