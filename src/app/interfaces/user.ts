export interface User {
  id: string,
  name: string,
  loggedIn: boolean,
  email: string,
  imageUrl: string | null,
  isLoading: true,
  password: string,
  company: string | null,
  preferences: object,
  termsVersion: string | null
}
