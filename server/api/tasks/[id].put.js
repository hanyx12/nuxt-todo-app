// 导入数据库模块
import { requireUser } from '../auth/utils';
import { getDatabase } from '../../database';

// 更新任务
export default defineEventHandler(async (event) => {
  // 验证用户身份
  const user = requireUser(event);
  if (!user.userId) {
    return user; // 返回错误信息
  }
  
  // 获取任务ID
  const { id } = event.context.params;
  const taskId = parseInt(id);
  
  // 获取请求体数据
  const body = await readBody(event);
  
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
  
  // 构建更新语句
  let updateFields = [];
  let updateValues = [];
  
  if (typeof body.completed === 'boolean') {
    updateFields.push('completed = ?');
    updateValues.push(body.completed);
  }
  
  if (body.title && body.title.trim()) {
    updateFields.push('title = ?');
    updateValues.push(body.title.trim());
  }
  
  // 如果有要更新的字段
  if (updateFields.length > 0) {
    updateValues.push(taskId);
    await db.run(
      `UPDATE tasks SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      updateValues
    );
  }
  
  // 获取更新后的任务
  const updatedTask = await db.get(
    'SELECT id, title, completed, image, user_id as userId FROM tasks WHERE id = ?',
    taskId
  );
  
  // 返回更新后的任务
  return updatedTask;
});