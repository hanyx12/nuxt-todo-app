export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-08-06',
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: [
    '@/assets/css/main.css'
  ],
  app: {
    head: {
      title: 'Nuxt3 任务管理',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Nuxt3 + Vue3 全栈任务管理应用' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  hooks: {
    async 'nitro:init'(nitro) {
      // 确保在服务器启动时初始化数据库
      const { initializeDatabase } = await import('./server/database');
      await initializeDatabase();
    }
  }
})