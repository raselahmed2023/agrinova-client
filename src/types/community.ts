export interface CommunityReply {
  _id: string;

  authorId: string;

  authorName: string;

  content: string;

  createdAt: string;
}

export interface CommunityComment {
  _id: string;

  authorId: string;

  authorName: string;

  content: string;

  replies: CommunityReply[];

  createdAt: string;
}

export type CommunityPostStatus =
  | "ACTIVE"
  | "REMOVED";

export interface CommunityPost {
  _id: string;

  authorId: string;

  authorName: string;

  content: string;

  images: string[];

  likes: string[];

  likeCount: number;

  commentCount: number;

  likedByMe: boolean;

  comments: CommunityComment[];

  status: CommunityPostStatus;

  moderationReason?: string;

  removedAt?: string;

  removedBy?: string;

  createdAt: string;

  updatedAt: string;
}

export interface CommunityFarmerProfile {
  _id: string;

  name: string;

  location: string;

  joinedAt: string;

  postCount: number;
}

export interface CommunityMeta {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}

export interface CommunityProfileResponse {
  profile: CommunityFarmerProfile;

  posts: CommunityPost[];

  meta: CommunityMeta;
}

export interface CommunityFeedResponse {
  posts: CommunityPost[];

  meta?: {
    page?: number;

    limit?: number;

    total?: number;

    totalPages?: number;

    [key: string]: unknown;
  };
}