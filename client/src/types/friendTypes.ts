export interface Friend {
  id: string;
  username: string;
  fullname: string;
  avatar: string;
  friends_since?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
