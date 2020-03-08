export interface PasswordServiceInterface {
  hash: (plaintextPsw: string) => Promise<string>,
  compare: (plaintextPsw: string, hashedPsw: string) => Promise<boolean>,
}
