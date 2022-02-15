/* eslint-disable */
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTeamsLeagues1644873028827 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE league_team (
            id uuid NOT NULL DEFAULT uuid_generate_v4(),
            league_id uuid,
            team_id uuid,
            created_at timestamp DEFAULT now(),
            updated_at timestamp DEFAULT now(),
            PRIMARY KEY (id),
            CONSTRAINT FK_league_id
                FOREIGN KEY(league_id) 
	            REFERENCES "leagues"(id),
            CONSTRAINT FK_team_id
                FOREIGN KEY(team_id) 
                REFERENCES "teams"(id)
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "league_team" DROP CONSTRAINT "FK_league_id"`);
        await queryRunner.query(`ALTER TABLE "league_team" DROP CONSTRAINT "FK_team_id"`);

        await queryRunner.query(`DROP TABLE "league_team"`);
    }

}
