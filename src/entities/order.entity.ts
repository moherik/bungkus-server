import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { MenuVariants, OrderType } from "../dto";
import { OrderStatus } from "../dto/order.dto";
import { MenuItem } from "./menu.entity";
import { Merchant } from "./merchant.entity";
import { User } from "./user.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: OrderType, default: OrderType.PICKUP })
  type?: OrderType;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
  status?: OrderStatus;

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn({ name: "created_at" })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  @Exclude()
  updatedAt: Date;

  @ManyToOne(() => Merchant, (merchant) => merchant.orders, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "merchant_id" })
  merchant: Merchant;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => Cart, (cart) => cart.order, { onDelete: "SET NULL" })
  carts: Cart[];
}

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "menu_name" })
  menuName: string;

  @Column("simple-json", { nullable: true, default: [] })
  variants?: MenuVariants[];

  @Column({ name: "special_instruction", nullable: true })
  specialInstruction?: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  discount?: number;

  @Column()
  qty: number;

  @ManyToOne(() => MenuItem, (item) => item.carts, { onDelete: "SET NULL" })
  @JoinColumn({ name: "menu_id" })
  menuItem: MenuItem;

  @ManyToOne(() => Order, (order) => order.carts, { onDelete: "SET NULL" })
  @JoinColumn({ name: "order_id" })
  order: Order;
}
