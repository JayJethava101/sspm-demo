import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('organizations')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'db_name', unique: true })
  dbName: string;

  @Column({ name: 'db_user' })
  dbUser: string;

  @Column({ name: 'db_password' })
  dbPassword: string;

  @Column({ name: 'db_host' })
  dbHost: string;

  @Column({ name: 'db_port' })
  dbPort: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}