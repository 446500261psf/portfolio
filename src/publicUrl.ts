/**
 * public/ 下的资源在子路径部署（如 /portfolio/）时须带 Vite 的 `base`。
 * 用 import.meta.env.BASE_URL 拼接，开发环境为 `/`，生产为 `/仓库名/`。
 */
export function publicUrl(path: string): string {
  const p = path.replace(/^\//, '')
  return `${import.meta.env.BASE_URL}${p}`
}
