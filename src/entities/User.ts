import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

import { UserRole } from "../utils/type";
import Bandwidth from "./Bandwidth";

@Entity("users")
class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  ip: string;

  @Column({ type: "bigint", nullable: true })
  limit: number;

  @Column({ default: false })
  status: boolean;

  @Column({ type: "timestamptz", nullable: true })
  lastAccessTime: Date;

  @Column({ type: "enum", enum: ["admin", "user"], default: "user" })
  role: UserRole;

  @CreateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
    select: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
    select: false,
  })
  updatedAt: Date;

  @OneToMany(() => Bandwidth, (bandwidth) => bandwidth.user)
  bandwidths: Bandwidth[];

  getUser() {
    return {
      id: this.id,
      username: this.username,
      role: this.role,
      name: this.name,
      ip: this.ip,
      limit: this.limit,
      status: this.status,
      lastAccessTime: this.lastAccessTime,
    };
  }
}

export default User;
