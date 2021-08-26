import { Exclude, Expose } from "class-transformer";
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
import { MenuVariants } from "../dto/menu.dto";
import { Merchant } from "./merchant.entity";
import { Cart } from "./order.entity";

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => MenuItem, (item) => item.menu, { onDelete: "CASCADE" })
  items: MenuItem[];

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive?: boolean;

  @Column({ nullable: true })
  order: number;

  @CreateDateColumn({ name: "created_at" })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  @Exclude()
  updatedAt: Date;

  @ManyToOne(() => Merchant, (merchant) => merchant.menus, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "merchant_id" })
  merchant: Merchant;
}

@Entity({ name: "menu_items" })
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  discount?: number;

  @Column({ name: "image_url", nullable: true })
  imageUrl?: string;

  @Column("simple-json", { nullable: true })
  variants: MenuVariants[];

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive?: boolean;

  @Column({ nullable: true })
  order: number;

  @CreateDateColumn({ name: "created_at" })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  @Exclude()
  updatedAt: Date;

  @ManyToOne(() => Menu, (menu) => menu.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "menu_id" })
  menu: Menu;

  @OneToMany(() => Cart, (cart) => cart.menuItem)
  carts: Cart[];
}
