import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import User from "./User";

@Entity("bandwidth")
class Bandwidth {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "date" })
  date: Date;

  @Column()
  ip: string;

  @Column({ type: "bigint", default: 0 })
  runtime: number;

  @Column({ type: "bigint", default: 0 })
  usage: number;

  @CreateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.bandwidths)
  user: User;
}

export default Bandwidth;
