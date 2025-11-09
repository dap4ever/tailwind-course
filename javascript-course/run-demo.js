// Runner genérico CommonJS: node javascript-course/run-demo.js 03
const path = require('path')
const fs = require('fs')

const num = process.argv[2] || '01'
const file = path.join(__dirname, 'lessons', `demo-${num}.js`)
if (!fs.existsSync(file)) {
  console.error('Demo não encontrada:', file)
  process.exit(1)
}
require(file)
