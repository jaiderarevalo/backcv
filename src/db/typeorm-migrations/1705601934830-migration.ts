import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1705601934830 implements MigrationInterface {
    name = 'Migration1705601934830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` varchar(255) NULL`);
    }

}
