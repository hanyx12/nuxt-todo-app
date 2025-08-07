<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- 头部导航 -->
    <header class="bg-blue-600 text-white shadow-md">
      <div class="container mx-auto px-4 py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold">Nuxt3 任务管理</h1>
            <p class="text-blue-100 mt-1">全栈 Vue3 任务管理应用示例</p>
          </div>
          
          <div v-if="user" class="flex items-center space-x-4">
            <span>欢迎, {{ user.username }}!</span>
            <button 
              @click="handleLogout"
              class="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
            >
              登出
            </button>
          </div>
          
          <div v-else class="flex space-x-2">
            <NuxtLink 
              to="/login" 
              class="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
            >
              登录
            </NuxtLink>
            <NuxtLink 
              to="/register" 
              class="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              注册
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="flex-grow container mx-auto px-4 py-8">
      <slot />
    </main>

    <!-- 页脚 -->
    <footer class="bg-gray-800 text-white py-6">
      <div class="container mx-auto px-4 text-center">
        <p>&copy; {{ new Date().getFullYear() }} Nuxt3 + Vue3 全栈应用</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref(null);

// 定义更新用户状态的方法
const updateUserState = () => {
  // 从localStorage获取用户信息
  const userStr = localStorage.getItem('user');
  if (userStr) {
    user.value = JSON.parse(userStr);
  } else {
    user.value = null;
  }
};

onMounted(() => {
  // 初始化用户状态
  updateUserState();
  
  // 监听登录事件
  window.addEventListener('user-login', updateUserState);
  window.addEventListener('user-logout', updateUserState);
});

// 在组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener('user-login', updateUserState);
  window.removeEventListener('user-logout', updateUserState);
});

const handleLogout = () => {
  // 清除localStorage中的用户信息
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // 清除用户信息
  user.value = null;
  
  // 触发登出事件
  window.dispatchEvent(new Event('user-logout'));
  
  // 跳转到登录页
  router.push('/login');
};
</script>

<style>
/* 全局样式 */
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}
</style>