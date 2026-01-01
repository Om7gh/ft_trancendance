import type { Friend } from '@/types/friendTypes';
import api from '../clientHttpService';

export default abstract class FriendsService {
    static async getFriends() {
        const { data } = await api.get('/api/friends');
        return data;
    }

    static async getFriend(id: string) {
        const { data } = await api.get(`/api/friends/${id}`);
        return data;
    }

    static async unfriend(id: string) {
        const { data } = await api.delete(`/api/friends/${id}`);
        return data;
    }

    static async sendRequest(id: string) {
        const { data } = await api.post('/api/friends/requests', { uid: id });
        return data;
    }

    static async getReceivedRequests(): Promise<Friend[]> {
        const { data } = await api.get<Friend[]>(
            '/api/friends/requests/received'
        );
        return data as Friend[];
    }

    static async getSentRequests(): Promise<Friend[]> {
        const { data } = await api.get<Friend[]>('/api/friends/requests/sent');
        return data as Friend[];
    }

    static async accept(id: string) {
        const { data } = await api.put(`/api/friends/requests/${id}/approve`);
        return data;
    }

    static async reject(id: string) {
        const { data } = await api.delete(`/api/friends/requests/${id}/reject`);
        return data;
    }

    static async cancel(id: string) {
        const { data } = await api.delete(`/api/friends/requests/${id}/cancel`);
        return data;
    }
}
