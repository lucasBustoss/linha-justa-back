/* eslint-disable */
import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterFixtureInsertAnalyzedColumn1645048586428 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE fixtures ADD COLUMN "analyzed" boolean NOT NULL DEFAULT false`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE fixtures DROP COLUMN "analyzed"`)
    }

}
