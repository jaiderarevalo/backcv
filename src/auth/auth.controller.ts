import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserResponse } from 'src/types/type';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { loginUser } from 'src/user/dto/login-user.dto';
import { UserService } from 'src/user/user.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtservice: JwtService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: loginUser) {
    const user = await this.userService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    console.log(user);

    if (!user) {
      throw new HttpException('', HttpStatus.BAD_REQUEST);
    }
    const payload = { sub: user.id };
    console.log(payload);

    const accessToken = this.jwtservice.sign(payload);

    const { ...rest } = user;
    return { accessToken, user: rest };
  }

  @Post('register')
  async create(@Body() createuserdto: CreateUserDto) {
    console.log('register', createuserdto);
    if (createuserdto.password !== createuserdto.confirmPassword) {
      throw new BadRequestException({
        statusCode: 400,
        message: {
          email: ['Las contraseñas no coinciden'],
        },
      });
    }
    const user = await this.userService.create(createuserdto);
    console.log(user);

    const { ...result } = user;
    return result as UserResponse;
  }
}
