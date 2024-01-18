import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1705602247450 implements MigrationInterface {
    name = 'Migration1705602247450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` varchar(255) NULL`);
    }

}
