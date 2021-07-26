export { SignInPayload } from "./user.dto";
export { CreateMerchantPayload, UpdateMerchantPayload } from "./merchant.dto";
export {
  CreateMenuPayload,
  CreateMenuItemPayload,
  MenuVariants,
  UpdateMenuPayload,
  UpdateMenuItemPayload,
} from "./menu.dto";
export { OrderType } from "./order.dto";
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
