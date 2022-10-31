import { resolve } from 'path'
import { defineConfig } from 'vite'
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.js'),
      name: '@jcsj/xml-js',
      fileName: 'xml-js',
    },
  }
})