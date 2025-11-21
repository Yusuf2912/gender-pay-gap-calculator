import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/salary-predict': {
        target: 'https://svo7xmgnz5.execute-api.us-east-1.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => {
          // Remove /api/salary-predict and replace with /get-salary-predict
          const newPath = path.replace(/^\/api\/salary-predict/, '/get-salary-predict');
          console.log('Proxying:', path, '->', newPath);
          return newPath;
        },
        secure: true,
      }
    }
  }
})
