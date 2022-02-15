/* eslint-disable camelcase */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import RankingTeam from './RankingTeam';
import RankingCategory from './RankingCategory';

@Entity('rankings')
class Ranking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  league_id: string;

  @OneToMany(() => RankingTeam, team => team.ranking, {
    eager: true,
  })
  teams: RankingTeam[];

  @OneToMany(() => RankingCategory, team => team.ranking, {
    eager: true,
  })
  categories: RankingCategory[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Ranking;
