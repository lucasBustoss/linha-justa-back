/* eslint-disable */
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFairLines1645132383976 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE fairlines (
            id uuid NOT NULL DEFAULT uuid_generate_v4(),
            fixture_id uuid,
            homeTeam_id uuid, 
            awayTeam_id uuid, 
            homeCategory varchar(2),
            homeCategory_index INT,
            awayCategory varchar(2),
            awayCategory_index INT,
            homeMustwin_score INT,
            homeMisses_score INT,
            awayMustwin_score INT,
            awayMisses_score INT,
            percentAddition DECIMAL(10, 2),
            initialHome_percent DECIMAL(10, 2),
            initialDraw_percent DECIMAL(10, 2),
            initialAway_percent DECIMAL(10, 2),
            finalHome_percent DECIMAL(10, 2),
            finalDraw_percent DECIMAL(10, 2),
            finalAway_percent DECIMAL(10, 2),
            created_at timestamp DEFAULT now(),
            updated_at timestamp DEFAULT now(),
            CONSTRAINT fk_fixture_id
                FOREIGN KEY(fixture_id) 
	            REFERENCES "fixtures"(id),
            CONSTRAINT fk_hometeam_id
                FOREIGN KEY(hometeam_id) 
                REFERENCES "teams"(id),
            CONSTRAINT fk_awayteam_id
                FOREIGN KEY(awayteam_id) 
                REFERENCES "teams"(id)
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fairlines" DROP CONSTRAINT "fk_fixture_id"`);
        await queryRunner.query(`ALTER TABLE "fairlines" DROP CONSTRAINT "fk_hometeam_id"`);
        await queryRunner.query(`ALTER TABLE "fairlines" DROP CONSTRAINT "fk_awayteam_id"`);

        await queryRunner.query(`DROP TABLE "fairlines"`);
    }

}
