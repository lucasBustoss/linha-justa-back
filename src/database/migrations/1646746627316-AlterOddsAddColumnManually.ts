/* eslint-disable */
import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterOddsAddColumnManually1646746627316 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE oddlines ADD COLUMN "manually" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE oddlines DROP COLUMN "manually"`)
    }

}
