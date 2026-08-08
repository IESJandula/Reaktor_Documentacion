import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

const manualChunks = (id: string) => {
  const normalizedId = id.replaceAll('\\', '/')

  if (!normalizedId.includes('/node_modules/')) return undefined

  if (
    normalizedId.includes('/node_modules/vue/')
    || normalizedId.includes('/node_modules/@vue/')
  ) return 'vue'

  if (
    normalizedId.includes('/node_modules/firebase/')
    || normalizedId.includes('/node_modules/@firebase/')
  ) return 'firebase'

  return undefined
}

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
