export { SignInPayload } from "./user.dto";
export { CreateMerchant, UpdateMerchant } from "./merchant.dto";
export { JWTPayload } from "./jwt.dto";

export interface ApiResponse {
  code: number;
  data?: any;
  errors?: any;
}

export const apiResponse = ({
  code,
  data,
  errors,
}: ApiResponse): ApiResponse => ({
  code,
  data,
  errors,
});
