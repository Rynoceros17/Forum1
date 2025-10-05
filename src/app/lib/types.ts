import { Timestamp } from "firebase/firestore";

export type Post = {
  id: string;
  system: string;
  author: string;
  avatar: string;
  time?: string; // Kept for mock data
  createdAt?: Timestamp; // For Firestore data
  title: string;
  content: string;
  imageUrl?: string;
  thrust: number;
  commentCount: number;
};
