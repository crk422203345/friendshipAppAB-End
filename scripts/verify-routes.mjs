import fs from 'node:fs'
import path from 'node:path'

const projectRoot = process.cwd()
const pageConfig = JSON.parse(fs.readFileSync(path.join(projectRoot, 'pages.json'), 'utf8'))
const routes = new Set(pageConfig.pages.map((page) => `/${page.path}`))
const errors = []

for (const route of routes) {
  const pageFile = path.join(projectRoot, `${route.slice(1)}.vue`)
  if (!fs.existsSync(pageFile)) errors.push(`路由缺少页面文件：${route}`)
}

const sourceRoots = ['components', 'composables', 'config', 'core', 'pages', 'services']
const sourceFiles = [path.join(projectRoot, 'App.vue'), path.join(projectRoot, 'main.js')]

function collectFiles(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name)
    if (entry.isDirectory()) collectFiles(filePath)
    else if (/\.(vue|js)$/.test(entry.name)) sourceFiles.push(filePath)
  }
}

for (const sourceRoot of sourceRoots) collectFiles(path.join(projectRoot, sourceRoot))

for (const sourceFile of sourceFiles) {
  const source = fs.readFileSync(sourceFile, 'utf8')
  for (const match of source.matchAll(/\/pages\/[A-Za-z0-9_/?=&.-]+/g)) {
    const target = match[0].split('?')[0]
    if (!target.endsWith('/') && !routes.has(target)) {
      errors.push(`未注册的页面跳转：${target}（${path.relative(projectRoot, sourceFile)}）`)
    }
  }
}

if (errors.length) {
  for (const error of errors) console.error(error)
  process.exit(1)
}

console.log(`路由检查通过：${routes.size} 个页面，${sourceFiles.length} 个源码文件`)
