import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMigration1750861158318 implements MigrationInterface {
  name = 'CreateMigration1750861158318';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "vector";`);
    await queryRunner.query(`
            ALTER TABLE "recipes"            
            ADD COLUMN "embedding" vector(768);            
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "recipes"            
            DROP COLUMN "embedding";            
        `);
  }
}
