import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { loginUser } from 'src/user/dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import { ROLES_KEY, Roles } from './decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guard/roles.guard';
import { Role } from 'src/interfaces/role.enum';
import { Auth } from './decorators/auth.decorator';
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

    if (!user) {
      throw new HttpException('', HttpStatus.BAD_REQUEST);
    }
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtservice.sign(payload);

    const { ...rest } = user;
    return { accessToken, user: rest.email };
  }
  @Post('register')
  @Auth(Role.Admin)
  async create(@Body() createuserdto: CreateUserDto) {
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

    const { email, name, role } = user;
    return { email, name, role };
  }
}
