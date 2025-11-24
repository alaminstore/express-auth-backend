import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import * as bcrypt from "bcrypt";

export type AuthType = "google" | "github" | "facebook" | "credentials";

@Entity({ name: "users" })
export class Users {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ length: 255, nullable: true })
  password!: string;

  @Column({ default: "credentials" })
  type!: AuthType;

  @Column({ default: true })
  isActive!: boolean;

  // Laravel-like timestamps
  @CreateDateColumn({ type: "datetime" })
  created_at!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updated_at!: Date;

  // Auto-hash password
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
