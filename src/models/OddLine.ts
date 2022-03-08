/* eslint-disable camelcase */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('oddlines')
class OddLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fixture_id: string;

  @Column({ name: 'homeline' })
  homeLine: string;

  @Column({ name: 'oddhome' })
  oddHome: string;

  @Column({ name: 'awayline' })
  awayLine: string;

  @Column({ name: 'oddaway' })
  oddAway: string;

  @Column({ name: 'odddiff' })
  oddDiff: string;

  @Column()
  manually: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default OddLine;
