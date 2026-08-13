import type { MeasurementKey } from "@/lib/constants";

export type Role = "customer" | "tailor" | "admin";

export interface User {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  role: Role;
  shopName?: string;
  city?: string;
  bio?: string;
  experienceYears?: number;
  priceFrom?: number;
  ratingAvg?: number;
  ratingCount?: number;
  avatar?: string;
  portfolio?: string[];
  isActive: boolean;
  createdAt: string;
}

/** O'lchov qiymatlari — barcha maydonlar (sm) */
export type MeasurementValues = Record<MeasurementKey, number>;

export interface Measurement extends MeasurementValues {
  _id: string;
  user: string;
  title: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ClothingType = "dress" | "suit" | "pants" | "shirt" | "other";
export type OrderStatus = "pending" | "accepted" | "completed" | "rejected" | "cancelled";

export interface Order {
  _id: string;
  customer: User | string;
  tailor: User | string;
  clothingType: ClothingType;
  notes?: string;
  measurements: MeasurementValues;
  status: OrderStatus;
  price?: number;
  reviewed?: boolean;
  resultImage?: string;
  tailorComment?: string;
  acceptedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Tailor {
  _id: string;
  name: string;
  shopName?: string;
  city?: string;
  bio?: string;
  phone?: string;
  experienceYears?: number;
  priceFrom?: number;
  ratingAvg?: number;
  ratingCount?: number;
  avatar?: string;
  portfolio?: string[];
  createdAt?: string;
}

export type NotificationType =
  | "order_new"
  | "order_accepted"
  | "order_rejected"
  | "order_completed"
  | "order_cancelled"
  | "message";

export interface AppNotification {
  _id: string;
  type: NotificationType;
  title: string;
  body?: string;
  order?: string;
  read: boolean;
  createdAt: string;
}

export interface Review {
  _id: string;
  tailor: string;
  customer: { _id: string; name: string } | string;
  order: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ChatMessage {
  _id: string;
  order: string;
  sender: { _id: string; name: string; role: Role } | string;
  text: string;
  createdAt: string;
}
