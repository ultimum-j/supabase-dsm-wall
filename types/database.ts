export type User = {
  id: string;
  username: string;
  password_hash: string;
  bio?: string | null;
  avatar_url?: string | null;
  created_at: string;
};

export type PublicUser = Omit<User, 'password_hash'>;

export type Post = {
  id: string;
  user_id: string;
  type: 'photo' | 'code';
  file_url: string;
  caption?: string | null;
  created_at: string;
};
