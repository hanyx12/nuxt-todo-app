<template>
  <div>
    <h1 class="text-3xl font-bold text-center mb-8">我的任务</h1>
    
    <!-- 添加任务表单 -->
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
      <form @submit.prevent="addTask" class="flex gap-2">
        <input
          v-model="newTask"
          type="text"
          placeholder="添加新任务..."
          class="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
        <button
          type="submit"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          添加
        </button>
      </form>
    </div>

    <!-- 任务列表 -->
    <div class="max-w-2xl mx-auto">
      <div 
        v-for="task in tasks" 
        :key="task.id"
        class="bg-white rounded-lg shadow-md p-6 mb-4 flex items-center justify-between"
      >
        <div class="flex items-center">
          <input 
            type="checkbox" 
            :checked="task.completed"
            @change="toggleTask(task)"
            class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          >
          <span 
            :class="{ 'line-through text-gray-500': task.completed }"
            class="ml-3 text-lg"
          >
            {{ task.title }}
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <!-- 图片缩略图 -->
          <div v-if="task.image" class="relative">
            <img 
              :src="task.image" 
              alt="Task" 
              class="w-10 h-10 object-cover rounded cursor-pointer border border-gray-200"
              @click="viewImage(task.image)"
            >
          </div>
          
          <!-- 上传图片按钮（仅在任务未完成时显示） -->
          <label 
            v-else-if="task.completed"
            class="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center"
          >
            <input 
              type="file" 
              @change="uploadImage(task, $event)" 
              accept="image/*" 
              class="hidden"
            >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
            </svg>
            <span class="ml-1">上传图片</span>
          </label>
          
          <!-- 删除任务按钮 -->
          <button
            @click="deleteTask(task)"
            class="text-red-600 hover:text-red-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="tasks.length === 0" class="text-center py-12">
        <p class="text-gray-500 text-lg">还没有任务，添加你的第一个任务吧！</p>
      </div>
    </div>

    <!-- 图片查看模态框 -->
    <div v-if="showImageModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div class="relative">
        <button
          @click="showImageModal = false"
          class="absolute -top-10 right-0 text-white text-2xl"
        >
          &times;
        </button>
        <img 
          :src="selectedImage" 
          alt="Task" 
          class="max-w-screen-md max-h-screen-md"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

definePageMeta({
  middleware: ['auth']
});

const tasks = ref([]);
const newTask = ref('');
const showImageModal = ref(false);
const selectedImage = ref('');

// 获取认证头
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  if (token) {
    return {
      'Authorization': `Bearer ${token}`
    }
  }
  return {}
}

// 获取任务列表
const fetchTasks = async () => {
  try {
    const data = await $fetch('/api/tasks', {
      headers: getAuthHeaders()
    });
    tasks.value = data;
  } catch (error) {
    console.error('获取任务失败:', error);
  }
};

// 添加任务
const addTask = async () => {
  if (!newTask.value.trim()) return;
  
  try {
    const task = await $fetch('/api/tasks', {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: {
        title: newTask.value.trim()
      }
    });
    
    tasks.value.push(task);
    newTask.value = '';
  } catch (error) {
    console.error('添加任务失败:', error);
    alert(error.data?.message || '添加任务失败');
  }
};

// 切换任务完成状态
const toggleTask = async (task) => {
  try {
    const updatedTask = await $fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: {
        completed: !task.completed
      }
    });
    
    task.completed = updatedTask.completed;
  } catch (error) {
    console.error('更新任务失败:', error);
    alert(error.data?.message || '更新任务失败');
  }
};

// 删除任务
const deleteTask = async (task) => {
  if (!confirm('确定要删除这个任务吗？')) return;
  
  try {
    await $fetch(`/api/tasks/${task.id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    tasks.value = tasks.value.filter(t => t.id !== task.id);
  } catch (error) {
    console.error('删除任务失败:', error);
    alert(error.data?.message || '删除任务失败');
  }
};

// 上传图片
const uploadImage = async (task, event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const response = await $fetch(`/api/tasks/${task.id}/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });
    
    task.image = response.imageUrl;
  } catch (error) {
    console.error('上传图片失败:', error);
    alert(error.data?.message || '上传图片失败');
  }
};

// 查看图片
const viewImage = (imageUrl) => {
  selectedImage.value = imageUrl;
  showImageModal.value = true;
};

onMounted(() => {
  fetchTasks();
});
</script>

<style scoped>
/* 页面特定样式 */
</style>