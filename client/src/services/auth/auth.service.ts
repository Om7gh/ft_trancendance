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
        const { data } = await api.post('/api/auth/signup', registerForm);
        return data;
    }

    static async login(loginForm: LoginForm) {
        const { data } = await api.post('/api/auth/login', loginForm);
        return data;
    }

    static async logout() {
        const [revokeResponse, logoutResponse] = await Promise.all([
            api.post('/api/auth/refresh/revoke'),
            api.post('/api/auth/logout'),
        ]);
        return {
            revoked: revokeResponse.data,
            logout: logoutResponse.data,
        };
    }

    static async checUsername(username: Username) {
        const { data } = await api.post('/api/auth/check-username', username);
        return data;
    }

    static async setUsername(username: Username) {
        const { data } = await api.post('/api/auth/set-username', username);
        return data;
    }

    static async completeProfile(profileData: ProfileData) {
        const formData = new FormData();
        formData.append('avatar', profileData.avatar);
        formData.append('bio', profileData.bio);
        const { data } = await api.post('/api/auth/complete-profile', formData);
        return data;
    }

    static async verifyLogin(code: TwoFACode) {
        const { data } = await api.post('/api/auth/2fa/verify-login', code);
        return data;
    }

    static async forgotPassword(email: Email) {
        const { data } = await api.post('/api/auth/forgot-password', email);
        return data;
    }

    static async resetPassword(password: PasswordData) {
        const { data } = await api.post('/api/auth/reset-password', password);
        return data;
    }

    static async userInfo() {
        const { data } = await api.get('/api/auth/userinfo');
        return data;
    }

    static async getProfile(username: string) {
        const { data } = await api.get(`/api/users/${username}`);
        return data;
    }
}
