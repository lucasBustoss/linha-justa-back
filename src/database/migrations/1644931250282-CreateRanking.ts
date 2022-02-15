/* eslint-disable */
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRanking1644931250282 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE rankings (
            id uuid NOT NULL DEFAULT uuid_generate_v4(),
            league_id uuid,
            created_at timestamp DEFAULT now(),
            updated_at timestamp DEFAULT now(),
            PRIMARY KEY (id),
            CONSTRAINT FK_league_id
                FOREIGN KEY(league_id) 
	            REFERENCES "leagues"(id)
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rankings" DROP CONSTRAINT "fk_league_id"`);

        await queryRunner.query(`DROP TABLE "rankings"`);
    }

}
