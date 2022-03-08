/* eslint-disable */
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFixtures1645032090641 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE fixtures (
            id uuid NOT NULL DEFAULT uuid_generate_v4(),
            league_id uuid,
            integration_id INT,
            date TIMESTAMPTZ,
            round VARCHAR(50),
            hometeam_id uuid,
            awayteam_id uuid,
            odd_home DECIMAL(5,2) NULL,
            odd_draw DECIMAL(5,2) NULL,
            odd_away DECIMAL(5,2) NULL,
            asianline_home VARCHAR(10) NULL,
            asianline_away VARCHAR(10) NULL,
            asianodd_home DECIMAL(5,2) NULL,
            asianodd_away DECIMAL(5,2) NULL,
            created_at timestamp DEFAULT now(),
            updated_at timestamp DEFAULT now(),
            PRIMARY KEY (id),
            CONSTRAINT fk_league_id
                FOREIGN KEY(league_id) 
	            REFERENCES "leagues"(id),
            CONSTRAINT fk_hometeam_id
                FOREIGN KEY(hometeam_id) 
                REFERENCES "teams"(id),
            CONSTRAINT fk_awayteam_id
                FOREIGN KEY(awayteam_id) 
                REFERENCES "teams"(id)
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fixtures" DROP CONSTRAINT "fk_league_id"`);
        await queryRunner.query(`ALTER TABLE "fixtures" DROP CONSTRAINT "fk_hometeam_id"`);
        await queryRunner.query(`ALTER TABLE "fixtures" DROP CONSTRAINT "fk_awayteam_id"`);

        await queryRunner.query(`DROP TABLE "fixtures"`);
    }

}
