import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth/auth.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { JwtStrategy } from './auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constaints';
import { ProjectModule } from './project/project.module';
import { Project } from './project/entities/project.entity';
import { SkillsModule } from './skills/skills.module';
import { Skill } from './skills/entities/skill.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (ConfigService: ConfigService) => ({
        type: 'mysql',
        host: ConfigService.get('DB_HOST'),
        port: ConfigService.get('DB_PORT'),
        username: ConfigService.get('DB_USERNAME'),
        password: ConfigService.get('DB_PASSWORD'),
        database: ConfigService.get('DB_DATABASE'),
        synchronize: false,
        migrationsRun: true,
        migrations: ['src/migrations/*.ts'],
        cli: { migrationsDir: 'src/migrations' },
        charset: 'utf8mb4',
        entities: [User,Project,Skill],
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ProjectModule,
    SkillsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, JwtStrategy],
})
export class AppModule {}
