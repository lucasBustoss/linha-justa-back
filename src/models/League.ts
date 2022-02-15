/* eslint-disable camelcase */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('leagues')
class League {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  integration_id: number;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  season_start: Date;

  @Column()
  season_end: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default League;
