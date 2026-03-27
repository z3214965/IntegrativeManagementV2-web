import JSEncrypt from 'jsencrypt/bin/jsencrypt.min';

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANQSbrmSLT1TTS7mT+GMN0tef9Ne8eJe\n' + 'mke+xDcv9l8LU2aRlSrKiqXR/Y1Dv6t10O1g3nWsBTvoIBvmIJtjMh0CAwEAAQ==';

const privateKey =
  'MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEA1BJuuZItPVNNLuZP\n' +
  '4Yw3S15/017x4l6aR77ENy/2XwtTZpGVKsqKpdH9jUO/q3XQ7WDedawFO+ggG+Yg\n' +
  'm2MyHQIDAQABAkBMVqJC7IqaY60J79/bWeThnY+335qEmPdCUjpBf2NZTIt+tZNY\n' +
  'SXoYm9MSfa/LkMbHk4oQ5AabaXoT+tQuZrLFAiEA8z8sXX0n8c6L1grnAJuc1ad9\n' +
  '8MzZj5ZF5ZZ4IcmlD7cCIQDfMNXjlzqBHk84CGSZi5I/QSFGT/UXqtz+2quC5wYk\n' +
  'ywIgDR3k+I2dL87hf4NK/Z9mj6behbOmL7X8wuqgQ8Ip4nUCIQCO5c2L8f9bO/Ss\n' +
  'g3Mle98e8KxFQFxD0vm7knXNUez1EQIgBt0CV1UnnGRZCcRE0HoXlQj7yIEObZoI\n' +
  'gFG3cCo0npE=';

/**
 * RSA加密(JSEncrypt)
 * @param {string} plaintext 明文
 * @returns {string} 密文
 */
export function RSAEncrypt(plaintext) {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(plaintext); // 对数据进行加密
}

/**
 * RSA解密(JSEncrypt)
 * @param {string} encryptedData 密文
 * @returns {string} 明文
 */
export function RSADecrypt(encryptedData) {
  const encryptor = new JSEncrypt();
  encryptor.setPrivateKey(privateKey); // 设置私钥
  return encryptor.decrypt(encryptedData); // 对数据进行解密
}

// Web Crypto加密配置
const cryptoConfig = {
  key: import.meta.env.VITE_CRYPTO_KEY,
  algorithm: 'AES-GCM',
  ivLength: 12,
};

/**
 * 字符串转 ArrayBuffer（Web Crypto专用）
 * @param {string} str
 * @returns {ArrayBuffer}
 */
function stringToArrayBuffer(str) {
  return new TextEncoder().encode(str);
}

/**
 * ArrayBuffer 转字符串
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
function arrayBufferToString(buffer) {
  return new TextDecoder().decode(buffer);
}

/**
 * Base64 编码（支持中文+特殊字符）
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
function base64Encode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

/**
 * Base64 解码
 * @param {string} str
 * @returns {ArrayBuffer}
 */
function base64Decode(str) {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * 生成AES密钥(Web Crypto)
 * @returns {Promise<CryptoKey>} 密钥
 */
async function generateAesKey() {
  const keyBuffer = stringToArrayBuffer(cryptoConfig.key);
  return crypto.subtle.importKey('raw', keyBuffer, cryptoConfig.algorithm, true, ['encrypt', 'decrypt']);
}

/**
 * AES加密(Web Crypto)
 * @param {string} plaintext 明文
 * @returns {string} 密文
 */
export async function AESEncrypt(plaintext) {
  const key = await generateAesKey();
  const iv = crypto.getRandomValues(new Uint8Array(cryptoConfig.ivLength));
  const data = stringToArrayBuffer(plaintext);
  const encrypted = await crypto.subtle.encrypt({ name: cryptoConfig.algorithm, iv }, key, data);
  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv, 0);
  result.set(new Uint8Array(encrypted), iv.length);
  return base64Encode(result.buffer);
}

/**
 * AES解密(Web Crypto)
 * @param {string} encryptedStr 密文
 * @returns {string} 明文
 */
export async function AESDecrypt(encryptedStr) {
  const key = await generateAesKey();
  const encryptedBuffer = base64Decode(encryptedStr);
  const iv = encryptedBuffer.slice(0, cryptoConfig.ivLength);
  const data = encryptedBuffer.slice(cryptoConfig.ivLength);
  const decrypted = await crypto.subtle.decrypt({ name: cryptoConfig.algorithm, iv }, key, data);
  return arrayBufferToString(decrypted);
}
