import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { UserRole } from "../utils/type";

@Entity("users")
class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

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

  getUser() {
    return { id: this.id, role: this.role, username: this.username };
  }
}

export default User;
