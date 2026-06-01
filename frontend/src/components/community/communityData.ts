// ── Nirvaha Community — shared data types & seed posts ──────────────────────

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userInitial: string;
  avatarColor: string;
  text: string;
  createdAt: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  userInitial: string;
  avatarColor: string;
  avatarUrl?: string;
  timestampValue: number;
  title: string;
  body: string;
  hashtags: string[];
  likes: number;
  liked: boolean;
  likedBy: string[];
  comments: Comment[];
  isCertified: boolean;
  isOnline: boolean;
  categories: string[];
  comments_count: number;
  shares: number;
  content?: string;
  user_id?: string;
  expiresAt?: string | Date;
}


