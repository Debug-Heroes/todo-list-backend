export interface IDecrypter {
  decrypt(encryptedValue: string): Promise<string>
}