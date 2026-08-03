import { JSEncrypt } from 'jsencrypt'

export function rsaEncrypt(content: string, publicKeyBase64: string): string {
  const publicKey = `-----BEGIN PUBLIC KEY-----\n${publicKeyBase64}\n-----END PUBLIC KEY-----`
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey)
  const encrypted = encryptor.encrypt(content)
  return encrypted || content
}
