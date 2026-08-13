import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const roots = ['core', 'services', 'pages', 'config', 'composables']
const forbidden = [
  ['演示验证码', /演示码|验证码已发送（演示/],
  ['固定演示密码', /password\.value\s*===\s*['"]123456['"]/],
  ['演示钱包服务', /services\/wallet|services\\wallet/],
  ['固定演示联系人', /张三|138\s*0000\s*8888/]
]

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await sourceFiles(target))
    else if (/\.(?:js|mjs|vue)$/.test(entry.name)) files.push(target)
  }
  return files
}

const failures = []
for (const root of roots) {
  for (const file of await sourceFiles(path.resolve(root))) {
    const source = await readFile(file, 'utf8')
    for (const [label, pattern] of forbidden) {
      if (pattern.test(source)) failures.push(`${path.relative(process.cwd(), file)}: ${label}`)
    }
  }
}

if (failures.length) {
  console.error(`源码检查失败：\n${failures.map((item) => `- ${item}`).join('\n')}`)
  process.exit(1)
}
console.log('源码检查通过：未发现演示凭据、假钱包或固定联系人')
