import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("clients")
class Client {
  @PrimaryGeneratedColumn("uuid")
  id: string;

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

  @CreateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
    select: false,
  })
  createdAt: Date;

  @Column({ select: false })
  createdBy: string;

  @UpdateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
    select: false,
  })
  updatedAt: Date;

  @Column({ select: false })
  updatedBy: string;

  getClient() {
    return {
      id: this.id,
      name: this.name,
      ip: this.ip,
      limit: this.limit,
      status: this.status,
      lastAccessTime: this.lastAccessTime,
    };
  }
}

export default Client;
