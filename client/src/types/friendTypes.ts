export interface Friend {
  uid: string;
  username: string;
  fullname: string;
  avatar: string;
  friends_since?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
