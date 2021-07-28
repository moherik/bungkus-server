import { MenuVariants } from "./menu.dto";

export enum OrderType {
  PICKUP = "pickup",
  DINEIN = "dinein",
  DELIVERY = "delivery",
}

export enum OrderStatus {
  PENDING = "pending",
  PROCESS = "process",
  FINISH = "finish",
  SUCCESS = "success",
  CANCEL = "cancel",
}

export interface CreateOrderPayload {
  type: OrderType;
  note?: string;
  carts: CreateOrderItemPayload[];
}

export interface CreateOrderItemPayload {
  menuId: string;
  menuName: string;
  variants: MenuVariants[];
  specialInstruction?: string;
  price: number;
  discount?: number;
  qty: number;
}
