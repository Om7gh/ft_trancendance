import { User } from '../models/user.js';

function dicordAvatar(payload: { id: string; avatar: string | null }) {
  if (!payload.avatar) {
    const defaultIndex = parseInt(payload.id) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
  }
  const isGif = payload.avatar.startsWith('a_');
  const ext = isGif ? 'gif' : 'png';
  return `https://cdn.discordapp.com/avatars/${payload.id}/${payload.avatar}.${ext}?size=512`;
}

export default function asUser(
  provider: string,
  data: any
): Partial<Omit<User, 'id'>> {
  if (!data.email) {
    throw new Error('data object has no email field');
  }

  const mappings: Record<string, () => Partial<User>> = {
    discord: () => ({
      first_name: data.global_name,
      email: data.email,
      avatar: dicordAvatar({ id: data.id, avatar: data.avatar }),
      email_verified: data.verified,
    }),
    google: () => ({
      first_name: data.given_name,
      last_name: data.family_name,
      email: data.email,
      avatar: data.picture,
      email_verified: data.email_verified,
    }),
  };

  const base = mappings[provider]();
  return { ...base, provider };
}

export function asUserInfo(user: User) {
  return {
    id: user.uid,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    last_login: user.last_login,
    last_logout: user.last_logout,
    username: user.username,
    provider: user.provider,
    mfa_enabled: user.mfa_enabled
  };
}
