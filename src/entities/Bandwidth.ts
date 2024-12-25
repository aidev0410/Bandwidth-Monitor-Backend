import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import User from "./User";

@Entity("bandwidth")
class Bandwidth {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "date", nullable: true })
  date: Date;

  @Column()
  ip: string;

  @Column({ type: "bigint", default: 0 })
  runtime: number;

  @Column({ type: "bigint", default: 0 })
  usage: number;

  @ManyToOne(() => User, (user) => user.bandwidths)
  user: User;
}

export default Bandwidth;
