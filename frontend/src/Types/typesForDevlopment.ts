export interface ListingType {
  _id: string;
  title: string;
  description: string;
  address: string;
  regularPrice: number;
  discountedPrice: number;
  bathrooms: number;
  bedrooms: number;
  furnished: boolean;
  parking: boolean;
  type: string;
  offer: boolean;
  imageURLs: string[];
  userRef: string;
  createdAt?: string; // Optional if needed on the frontend
  updatedAt?: string;
}

export interface ErrorObject {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface UserType {
  _id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  createdAt?: string; // Optional if needed on the frontend
  updatedAt?: string;
}
