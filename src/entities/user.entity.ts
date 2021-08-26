import { Exclude, Expose } from "class-transformer";
import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationCount,
  UpdateDateColumn,
} from "typeorm";
import { Menu } from "./menu.entity";
import { Merchant } from "./merchant.entity";
import { Order } from "./order.entity";

@Entity()
@Exclude()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ nullable: true })
  @Expose()
  name: string;

  @Column()
  @Expose()
  phone: string;

  @Column({ nullable: true, unique: true })
  email?: string;

  @Column({ name: "token", unique: true })
  @Index()
  token: string;

  @Column({ name: "token_updated_at", nullable: true })
  tokenUpdatedAt: Date;

  @Column({ nullable: true, name: "avatar_url" })
  @Expose()
  avatarUrl: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @OneToMany(() => Merchant, (merchant) => merchant.user, {
    onDelete: "CASCADE",
  })
  merchants: Merchant[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @ManyToMany(() => User, (user) => user.following, { cascade: true })
  @JoinTable({
    name: "follow",
    joinColumn: { name: "follower_id", referencedColumnName: "id" },
    inverseJoinColumn: {
      name: "following_id",
      referencedColumnName: "id",
    },
  })
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers, { onDelete: "CASCADE" })
  following: User[];

  @Expose()
  totalFollowing: number;

  @Expose()
  totalFollowers: number;

  @ManyToMany(() => Merchant)
  @JoinTable({
    name: "merchant_favorites",
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: {
      name: "merchant_id",
      referencedColumnName: "id",
    },
  })
  @Expose()
  favorites: Merchant[];
}
