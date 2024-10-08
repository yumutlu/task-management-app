import { Entity, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
}