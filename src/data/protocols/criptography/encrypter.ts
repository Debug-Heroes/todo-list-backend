export interface IEncrypter {
  encrypt(anyValue: string): Promise<string>
}
