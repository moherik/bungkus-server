import { getRepository } from "typeorm";
import { CreateOrderPayload, OrderStatus } from "../dto/order.dto";
import { Order } from "../entities";

const repository = () => getRepository(Order);

export class OrderService {
  async getMyOrder({
    userId,
    status,
  }: {
    userId: number;
    status: OrderStatus;
  }) {}

  async getMerchantOrder({
    userId,
    merchantId,
    status,
  }: {
    userId: number;
    merchantId: number;
    status: OrderStatus;
  }) {}

  async create({
    userId,
    merchantId,
    payload,
  }: {
    userId: number;
    merchantId: number;
    payload: CreateOrderPayload;
  }) {}

  async updateStatus({
    userId,
    orderId,
    status,
  }: {
    userId: number;
    orderId: number;
    status: OrderStatus;
  }) {}
}
