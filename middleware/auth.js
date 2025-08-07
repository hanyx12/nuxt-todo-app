export default defineNuxtRouteMiddleware((to, from) => {
  // 在服务端不执行localStorage操作
  if (process.server) {
    return;
  }
  
  // 检查用户是否已登录
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    // 如果访问的是需要认证的页面，重定向到登录页
    if (to.path !== '/login' && to.path !== '/register') {
      return navigateTo('/login');
    }
  } else {
    // 如果已登录但访问的是登录或注册页面，重定向到主页
    if (to.path === '/login' || to.path === '/register') {
      return navigateTo('/');
    }
  }
});