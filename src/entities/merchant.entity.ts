import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
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
  @Expose({ name: "image_url" })
  imageUrl?: string;

  @Column({ name: "banner_image_url", nullable: true })
  @Expose({ name: "banner_image_url" })
  bannerImageUrl?: string;

  @CreateDateColumn({ name: "created_at" })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  @Exclude()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.merchants, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;
}
