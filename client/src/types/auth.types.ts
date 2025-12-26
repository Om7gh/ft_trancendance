export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterForm extends LoginForm {
    first_name: string;
    last_name: string;
    confirmPassword: string;
}

export type TwoFACode = {
    code: string;
};

export type Username = {
    username: string;
};

export type ProfileData = {
    avatar: File;
    bio: string;
};

export type Email = {
    email: string;
};

export type PasswordData = {
    newPassword: string;
    confirmPasword: string;
};
