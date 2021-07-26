import { Expose, Transform } from "class-transformer";

export interface GetMerchantParams {
  lat?: number;
  long?: number;
  distance?: number;
  keyword?: string;
  take?: number;
  skip?: number;
}

export class CreateMerchantPayload {
  name: string;
  description?: string;
  address: string;
  location: { lat: number; long: number };
  open: { day: string; time: string }[];

  @Expose({ name: "image_url" })
  imageUrl?: string;

  @Expose({ name: "banner_image_url" })
  bannerImageUrl?: string;
}

export class UpdateMerchantPayload extends CreateMerchantPayload {}
