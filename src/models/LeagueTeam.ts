/* eslint-disable camelcase */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('league_team')
class LeagueTeam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  league_id: string;

  @Column('uuid')
  team_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default LeagueTeam;
