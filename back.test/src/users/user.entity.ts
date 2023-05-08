import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' }) // 'text'로 지정
  content: string;

  @Column({ default: true })
  isActive: boolean;
}
