export interface signInData {
  email: string;
  password: string;
}

export interface signUpData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface activationUSerData {
  code: string;
}

export interface completeProfile {
  avatar: File;
  bio: string;
  username: string;
}


export type Setup2FAResponse =
  | {
      success: boolean
      qrcode?: string
      uri?: string
      html?: string
    }
  | string