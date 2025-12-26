import type {
    Email,
    LoginForm,
    PasswordData,
    ProfileData,
    RegisterForm,
    TwoFACode,
    Username,
} from '@/types/auth.types';
import api from '../clientHttpService';

export default abstract class AuthService {
    static async register(registerForm: RegisterForm) {
        const res = await api.post('/api/auth/signup', registerForm);
        return res.data;
    }

    static async login(loginForm: LoginForm) {
        const res = await api.post('/api/auth/login', loginForm);
        return res.data;
    }

    static async logout(loginForm: LoginForm) {
        const res = await api.post('/api/auth/logout', loginForm);
        console.log('logged out ?', res.data)
        return res.data;
    }

    static async checUsername(username: Username) {
        const res = await api.post('/api/auth/check-username', username);
        return res.data;
    }

    static async setUsername(username: Username) {
        const res = await api.post('/api/auth/set-username', username);
        return res.data;
    }

    static async completeProfile(profileData: ProfileData) {
        const res = await api.post('/api/auth/complete-profile', profileData);
        return res.data;
    }

    static async verifyLogin(code: TwoFACode) {
        const res = await api.post('/api/auth/2fa/verify-login', code);
        return res.data;
    }

    static async forgotPassword(email: Email) {
        const res = await api.post('/api/auth/forgot-password', email);
        return res.data;
    }

    static async resetPassword(password: PasswordData) {
        const res = await api.post('/api/auth/reset-password', password);
        return res.data;
    }
}
