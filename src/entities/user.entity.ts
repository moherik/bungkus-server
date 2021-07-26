import { Exclude, Expose } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Merchant } from "./merchant.entity";

@Entity()
@Exclude()
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
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

  @OneToMany(() => Merchant, (merchant) => merchant.user)
  merchants: Merchant[];
}
