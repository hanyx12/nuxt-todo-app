// server/api/auth/utils.js

export function getUserFromToken(event) {
  try {
    // 从请求头获取token
    const authHeader = getHeader(event, 'authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7); // 移除 "Bearer " 前缀
    
    // 解码token（简化版）
    const payload = JSON.parse(atob(token));
    
    // 检查token是否过期
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return {
      userId: payload.userId,
      username: payload.username
    };
  } catch (error) {
    return null;
  }
}

export function requireUser(event) {
  const user = getUserFromToken(event);
  if (!user) {
    setResponseStatus(event, 401);
    return { error: '未授权访问' };
  }
  return user;
}