const DEVICE_ID_KEY = 'phoenix-device-id'

/**
 * 设备标识（FAST 5.1 设备数限制的前端侧）：localStorage 持久化的随机串。
 * 同一浏览器多次登录归并为同一设备，避免互踢。
 */
export function getDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY)
  if (!deviceId) {
    deviceId = crypto.randomUUID().replace(/-/g, '')
    localStorage.setItem(DEVICE_ID_KEY, deviceId)
  }
  return deviceId
}
