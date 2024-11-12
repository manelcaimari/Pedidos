const { defineConfig } = require('vite')
const fs = require('fs')

export default defineConfig({
  base: '/cliente',
  server: {
    host: 'dev-pedidos.com',
    port: 5177,
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
