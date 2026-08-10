/**
 * 文件下载与导出工具。
 *
 * 本文件解决什么问题：
 * - 统一处理后端返回的 Blob 文件流，自动从响应头提取文件名；
 * - 兼容用户取消、失败等场景，避免各页面重复写临时 <a> 标签逻辑。
 *
 * 修改注意点：
 * - 后端若通过 Content-Disposition 返回中文文件名，需确认编码方式；
 * - 大文件导出建议后续接入下载进度回调。
 */

/**
 * 触发浏览器下载。
 * @param blob - 文件二进制数据
 * @param filename - 下载文件名
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * 从 Content-Disposition 响应头解析文件名。
 * 优先解析 filename*=UTF-8''xxx，其次 filename="xxx"。
 */
export function extractFilename(header: string | null, fallback = 'download'): string {
  if (!header) return fallback

  const starMatch = header.match(/filename\*=UTF-8''([^;]+)/i)
  if (starMatch) {
    return decodeURIComponent(starMatch[1])
  }

  const quotedMatch = header.match(/filename="([^"]+)"/)
  if (quotedMatch) {
    return quotedMatch[1]
  }

  const unquotedMatch = header.match(/filename=([^;]+)/)
  if (unquotedMatch) {
    return unquotedMatch[1].trim()
  }

  return fallback
}
