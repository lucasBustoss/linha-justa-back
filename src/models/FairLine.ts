/* eslint-disable camelcase */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import League from './League/League';

@Entity('fairlines')
class FairLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fixture_id: string;

  integration_id: string;

  @Column({ name: 'hometeam_id' })
  homeTeam_id: string;

  @Column({ name: 'awayteam_id' })
  awayTeam_id: string;

  @Column({ name: 'homecategory' })
  homeCategory: string;

  @Column({ name: 'awaycategory' })
  awayCategory: string;

  @Column({ name: 'homemustwin_score' })
  homeMustWin_score: number;

  @Column({ name: 'homemisses_score' })
  homeMisses_score: number;

  @Column({ name: 'awaymustwin_score' })
  awayMustWin_score: number;

  @Column({ name: 'awaymisses_score' })
  awayMisses_score: number;

  @Column({ name: 'percentaddition' })
  percentAddition: number;

  @Column({ name: 'initialhome_percent' })
  initialHome_percent: number;

  @Column({ name: 'initialdraw_percent' })
  initialDraw_percent: number;

  @Column({ name: 'initialaway_percent' })
  initialAway_percent: number;

  @Column({ name: 'finalhome_percent' })
  finalHome_percent: number;

  @Column({ name: 'finaldraw_percent' })
  finalDraw_percent: number;

  @Column({ name: 'finalaway_percent' })
  finalAway_percent: number;

  league_id: string;

  league: League;

  homeAH: string;

  awayAH: string;

  homeOddAH: string;

  awayOddAH: string;

  homeAdjustedAH: string;

  awayAdjustedAH: string;

  homeAdjustedOdd: string;

  awayAdjustedOdd: string;

  evHome: string;

  evAway: string;

  oddManually: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default FairLine;
