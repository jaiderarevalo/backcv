import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { loginUser } from 'src/user/dto/login-user.dto';
import { UserService } from 'src/user/user.service';
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
      throw new BadRequestException();
    }
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtservice.sign(payload);

    const { email, role } = user;
    return { accessToken, email, role };
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

  @Get(':id')
  async GetUser(@Param('id') id: string) {
    const response = await this.userService.getOne(id);
    return response;
  }


  @HttpCode(200)
  @Post('validate-token')
  async validateToken(@Body() body: { token: string }) {
    try {
      const { sub } = this.jwtservice.verify(body.token);
      const user = await this.userService.findOne(sub);
      if (!user) {
        throw new UnauthorizedException();
      }
      const { password, ...rest } = user;

      console.log('Validación exitosa:', user);

      return { user: rest, accessToken: body.token };
    } catch (error) {
      console.log('el error es ', error);

      // Maneja específicamente los errores de autorización
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token Expirado');
      }

      throw new BadRequestException({
        message: `${error.message || 'Error desconocido'}`,
      });
    }
  }

}

