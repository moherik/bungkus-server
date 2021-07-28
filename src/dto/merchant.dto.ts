import { Expose } from "class-transformer";

export interface GetMerchantParams {
  userId: number;
  lat?: number;
  long?: number;
  distance?: number;
  keyword?: string;
  take?: number;
  skip?: number;
  categories?: string;
}

export class CreateMerchantPayload {
  name: string;
  description?: string;
  address: string;
  location: { lat: number; long: number };
  open: { day: string; time: string }[];
  categoryIds: number[];
  imageUrl?: string;
  bannerImageUrl?: string;
}

export class UpdateMerchantPayload extends CreateMerchantPayload {}
