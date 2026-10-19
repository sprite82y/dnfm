// 注册同步模块解析钩子，使测试可以加载使用无扩展名导入的生产代码。
// 注意：registerHooks 的 resolve 必须是同步函数，不能返回 Promise。
import { registerHooks } from 'node:module'
import { existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const CANDIDATE_SUFFIXES = ['.js', '.mjs', '/index.js']

registerHooks({
  resolve (specifier, context, nextResolve) {
    if (!specifier.startsWith('.') && !specifier.startsWith('/')) {
      return nextResolve(specifier, context)
    }
    try {
      return nextResolve(specifier, context)
    } catch (error) {
      if (error?.code !== 'ERR_MODULE_NOT_FOUND') throw error
      const parentPath = context.parentURL
        ? path.dirname(fileURLToPath(context.parentURL))
        : process.cwd()
      const base = path.resolve(parentPath, specifier)
      for (const suffix of CANDIDATE_SUFFIXES) {
        const candidate = base + suffix
        if (existsSync(candidate)) {
          return nextResolve(pathToFileURL(candidate).href, context)
        }
      }
      throw error
    }
  }
})
