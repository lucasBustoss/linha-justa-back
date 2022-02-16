/* eslint-disable*/
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRankingCategories1644934568138 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE rankings_categories (
            id uuid NOT NULL DEFAULT uuid_generate_v4(),
            ranking_id uuid,
            category VARCHAR(5),
            category_index INT,
            description VARCHAR(300),
            created_at timestamp DEFAULT now(),
            updated_at timestamp DEFAULT now(),
            PRIMARY KEY (id),
            CONSTRAINT FK_ranking_id
                FOREIGN KEY(ranking_id) 
	            REFERENCES "rankings"(id)
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rankings_categories" DROP CONSTRAINT "fk_ranking_id"`);

        await queryRunner.query(`DROP TABLE "rankings_categories"`);
    }

}
