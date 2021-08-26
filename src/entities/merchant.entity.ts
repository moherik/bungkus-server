import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Point } from "geojson";
import { User } from "./user.entity";
import {
  Exclude,
  Expose,
  Transform,
  TransformationType,
} from "class-transformer";
import { Menu } from "./menu.entity";
import { Order } from "./order.entity";

@Entity()
export class Merchant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  address: string;

  @Index({ spatial: true })
  @Column({ type: "geography", spatialFeatureType: "Point", srid: 4326 })
  @Transform(({ value, type }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      return {
        type: "Point",
        coordinates: [value.lat, value.long],
      };
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      return {
        lat: value.coordinates[0],
        long: value.coordinates[1],
      };
    }
  })
  location: Point;

  @Column("simple-json")
  open: [{ day: string; time: string }];

  @Column({ select: false, nullable: true, insert: false, update: false })
  distance: number;

  @Column({ name: "image_url", nullable: true })
  imageUrl?: string;

  @Column({ name: "banner_image_url", nullable: true })
  @Exclude()
  bannerImageUrl?: string;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive?: boolean;

  @CreateDateColumn({ name: "created_at" })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  @Exclude()
  updatedAt: Date;

  @ManyToMany(() => MerchantCategory, { onDelete: "CASCADE" })
  @JoinTable({
    name: "merchant_categories",
    joinColumn: {
      name: "merchant_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "category_id",
      referencedColumnName: "id",
    },
  })
  categories: MerchantCategory[];

  @ManyToOne(() => User, (user) => user.merchants, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => Menu, (menu) => menu.merchant, { onDelete: "CASCADE" })
  menus: Menu[];

  @OneToMany(() => Order, (order) => order.merchant, { onDelete: "CASCADE" })
  orders: Order[];
}

@Entity({ name: "merchant_category" })
export class MerchantCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
