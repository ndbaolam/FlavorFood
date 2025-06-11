import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmbedding1749579899978 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE recipes
          ADD COLUMN IF NOT EXISTS embedding vector(768)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE recipes
          DROP COLUMN IF EXISTS embedding
        `);
    }

}
