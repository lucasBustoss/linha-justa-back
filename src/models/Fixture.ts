/* eslint-disable camelcase */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import League from './League/League';
import Team from './Team';

@Entity('fixtures')
class Fixture {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  integration_id: number;

  @Column()
  date: Date;

  @Column()
  league_id: string;

  league: League;

  @Column()
  round: string;

  @Column()
  hometeam_id: string;

  hometeam: Team;

  @Column()
  awayteam_id: string;

  awayteam: Team;

  @Column()
  odd_home: string;

  @Column()
  odd_draw: string;

  @Column()
  odd_away: string;

  @Column()
  asianline_home: string;

  @Column()
  asianline_away: string;

  @Column()
  asianodd_home: string;

  @Column()
  asianodd_away: string;

  @Column()
  analyzed: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Fixture;
