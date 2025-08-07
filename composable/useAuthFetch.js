import { ref } from 'vue'

// 获取认证头
const getAuthHeaders = () => {
  if (process.server) {
    return {}
  }
  
  const token = localStorage.getItem('token')
  if (token) {
    return {
      'Authorization': `Bearer ${token}`
    }
  }
  
  return {}
}

// 带认证的fetch
export const useAuthFetch = () => {
  const authFetch = async (url, options = {}) => {
    // 添加认证头
    const headers = {
      ...getAuthHeaders(),
      ...options.headers
    }
    
    // 如果有body且是普通对象，设置Content-Type
    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }
    
    return await $fetch(url, {
      ...options,
      headers
    })
  }
  
  return { authFetch }
}