/* eslint-disable*/
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateLeagues1644867412726 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'leagues',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'integration_id',
                        type: 'decimal',
                        isUnique: true,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                    },
                    {
                        name: 'country',
                        type: 'varchar',
                    },
                    {
                        name: 'logo',
                        type: 'varchar',
                    },
                    {
                        name: 'season_start',
                        type: 'timestamp with time zone',
                    },
                    {
                        name: 'season_end',
                        type: 'timestamp with time zone',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('leagues');
    }
}
