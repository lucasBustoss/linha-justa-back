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

@Entity('rankings_categories')
class League {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ranking_id: string;

  @ManyToOne(() => Ranking)
  @JoinColumn({ name: 'ranking_id', referencedColumnName: 'id' })
  ranking: Ranking;

  @Column()
  category: string;

  @Column()
  category_index: number;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default League;
