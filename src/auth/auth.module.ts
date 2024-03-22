import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm'
import { UserModule } from 'src/user/user.module'
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constaints';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Repository<User>]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
