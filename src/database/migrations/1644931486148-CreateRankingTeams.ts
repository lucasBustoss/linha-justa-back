/* eslint-disable */
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRankingTeams1644931486148 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE rankings_teams (
            id uuid NOT NULL DEFAULT uuid_generate_v4(),
            ranking_id uuid,
            team_id uuid,
            category VARCHAR(5),
            homeAdvantage INT,
            form INT,
            shape INT,
            created_at timestamp DEFAULT now(),
            updated_at timestamp DEFAULT now(),
            PRIMARY KEY (id),
            CONSTRAINT FK_ranking_id
                FOREIGN KEY(ranking_id) 
	            REFERENCES "rankings"(id),
            CONSTRAINT FK_team_id
                FOREIGN KEY(team_id) 
                REFERENCES "teams"(id)
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rankings_teams" DROP CONSTRAINT "fk_ranking_id"`);
        await queryRunner.query(`ALTER TABLE "rankings_teams" DROP CONSTRAINT "fk_team_id"`);

        await queryRunner.query(`DROP TABLE "rankings_teams"`);
    }

}
