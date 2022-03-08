/* eslint-disable */
import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterLeagueAddStatsFairLineColumns1645213853750 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE leagues ADD COLUMN "homeadvantage_analysis" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE leagues ADD COLUMN "mustwin_analysis" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE leagues ADD COLUMN "form_analysis" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE leagues ADD COLUMN "shape_analysis" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE leagues ADD COLUMN "misses_analysis" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE leagues DROP COLUMN "homeadvantage_analysis"`)
        await queryRunner.query(`ALTER TABLE leagues DROP COLUMN "mustwin_analysis"`)
        await queryRunner.query(`ALTER TABLE leagues DROP COLUMN "form_analysis"`)
        await queryRunner.query(`ALTER TABLE leagues DROP COLUMN "shape_analysis"`)
        await queryRunner.query(`ALTER TABLE leagues DROP COLUMN "misses_analysis"`)
    }
}
