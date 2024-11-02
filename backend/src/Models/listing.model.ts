import { Schema, Document, model } from "mongoose";

export interface ListingSchema extends Document {
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
}

const listingSchema = new Schema<ListingSchema>(
  {
    title: {
      type: String,
      reqired: true,
    },
    description: {
      type: String,
      reqired: true,
    },
    address: {
      type: String,
      reqired: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountedPrice: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    parking: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
    },
    imageURLs: {
      type: [String],
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = model<ListingSchema>("Listing", listingSchema);

export default Listing;
