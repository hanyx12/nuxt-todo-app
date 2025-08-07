export default defineNuxtRouteMiddleware((to, from) => {
  // 在服务端不执行localStorage操作
  if (process.server) {
    return;
  }
  
  // 检查用户是否已登录
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  // 如果已登录，重定向到主页
  if (token && user) {
    return navigateTo('/');
  }
});