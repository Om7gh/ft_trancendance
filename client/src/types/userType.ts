export interface signInData {
  username: string;
  password: string;
}

export interface signUpData {
  username: string;
  email: string;
  password: string;
}

export interface activationUSerData {
  email: string;
  verificationCode: number;
}

export interface completeProfile {
  avatar: File;
  bio: string;
  username: string;
}
