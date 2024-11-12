const { defineConfig } = require('vite')
const fs = require('fs')

export default defineConfig({
  base: '/admin/login',
  server: {
    host: 'dev-pedidos.com',
    port: 5170,
    https: {
      key: fs.readFileSync('../../../certs/key_decrypted.pem'),
      cert: fs.readFileSync('../../../certs/certificate.pem')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    rollupOptions: {
      input: '/src/index.js'
    }
  }
})
