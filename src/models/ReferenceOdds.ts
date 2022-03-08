/* eslint-disable camelcase */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('referenceodds')
class ReferenceOdds {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  home_category: string;

  @Column()
  away_category: string;

  @Column()
  percent_home: number;

  @Column()
  percent_draw: number;

  @Column()
  percent_away: number;

  @Column()
  asianhandicap_home: number;

  @Column()
  asianhandicap_away: number;
}

export default ReferenceOdds;
