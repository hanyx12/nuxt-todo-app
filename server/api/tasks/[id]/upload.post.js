// 导入数据库模块
import { requireUser } from '../../auth/utils';
import { getDatabase } from '../../../database';

// 创建上传图片的API端点
export default defineEventHandler(async (event) => {
  try {
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
    
    // 获取上传的文件
    const files = await readMultipartFormData(event);
    if (!files || files.length === 0) {
      setResponseStatus(event, 400);
      return { error: '未提供图片文件' };
    }
    
    const file = files[0];
    
    // 验证文件类型（只允许图片）
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setResponseStatus(event, 400);
      return { error: '只允许上传 JPG、PNG、GIF 或 WebP 格式的图片' };
    }
    
    // 验证文件大小（限制为5MB）
    if (file.data.length > 5 * 1024 * 1024) {
      setResponseStatus(event, 400);
      return { error: '图片大小不能超过 5MB' };
    }
    
    // 生成文件名
    const timestamp = Date.now();
    const fileName = `task-${taskId}-${timestamp}.${file.type.split('/')[1]}`;
    const filePath = `./public/uploads/${fileName}`;
    
    // 确保 uploads 目录存在
    const fs = await import('fs');
    
    const uploadsDir = './public/uploads';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // 保存文件
    fs.writeFileSync(filePath, file.data);
    
    // 更新任务的图片路径
    await db.run(
      'UPDATE tasks SET image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      `/uploads/${fileName}`,
      taskId
    );
    
    // 返回成功响应
    return {
      success: true,
      imageUrl: `/uploads/${fileName}`
    };
  } catch (error) {
    console.error('上传图片失败:', error);
    setResponseStatus(event, 500);
    return { error: '上传图片失败' };
  }
});