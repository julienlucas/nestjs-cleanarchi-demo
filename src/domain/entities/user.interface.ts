import { Task } from '@domain/entities/task.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @OneToMany(_type => Task, task => task.user, { eager: true })
  tasks: Task[];
}

export class BearerToken {
  @ApiProperty()
  token: string;
}
