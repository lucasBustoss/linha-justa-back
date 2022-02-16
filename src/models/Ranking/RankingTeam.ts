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

import Ranking from './Ranking';

@Entity('rankings_teams')
class RankingTeam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ranking_id: string;

  @ManyToOne(() => Ranking)
  @JoinColumn({ name: 'ranking_id', referencedColumnName: 'id' })
  ranking: Ranking;

  @Column()
  team_id: string;

  team_name: string;

  @Column()
  category: string;

  @Column()
  homeadvantage: number;

  @Column()
  form: number;

  @Column()
  shape: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default RankingTeam;
