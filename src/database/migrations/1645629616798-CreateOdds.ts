/* eslint-disable*/
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOdds1645629616798 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE oddlines (
            id uuid NOT NULL DEFAULT uuid_generate_v4(),
            fixture_id uuid,
            homeLine varchar(20), 
            oddHome decimal(10,2), 
            awayLine varchar(20),
            oddAway decimal(10,2),
            oddDiff decimal(10,2),
            created_at timestamp DEFAULT now(),
            updated_at timestamp DEFAULT now(),
            CONSTRAINT fk_fixture_id
                FOREIGN KEY(fixture_id) 
	            REFERENCES "fixtures"(id)
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "oddlines" DROP CONSTRAINT "fk_fixture_id"`);

        await queryRunner.query(`DROP TABLE "oddlines"`);
    }

}
