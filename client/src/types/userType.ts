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
  email: string;
  verificationCode: number;
}

export interface completeProfile {
  avatar: File;
  bio: string;
  username: string;
}
