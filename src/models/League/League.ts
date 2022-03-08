/* eslint-disable camelcase */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Fixture from '../Fixture';

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
  logo: string;

  @Column()
  season_start: Date;

  @Column()
  season_end: Date;

  @Column()
  homeadvantage_analysis: number;

  @Column()
  mustwin_analysis: number;

  @Column()
  form_analysis: number;

  @Column()
  shape_analysis: number;

  @Column()
  misses_analysis: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default League;
