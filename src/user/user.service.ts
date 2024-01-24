import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { compareSync } from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      console.log("lo que llega",createUserDto);
      
      const salt = await bcrypt.genSalt(10);
      const res = this.userRepository.save({
        email: createUserDto.email.toLowerCase(),
        name: createUserDto.name,
        password: await bcrypt.hash(createUserDto.password, salt),
        role: createUserDto.role
      });
      if (!res) {
        throw new HttpException(
          'No se pudo crear el usuario',
          HttpStatus.BAD_REQUEST,
        );
      }
      return res; // Aquí se devuelve la instancia de User
    } catch (error) {
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getOne(id: string) {
    try {
      const response = await this.userRepository.findOne({ where: { id } });
      if (!response) {
        throw new HttpException(
          'no se pudo obtener el usuario',
          HttpStatus.BAD_REQUEST,
        );
      }
      return response;
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async findEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  async findOne(id: string): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async checkPassword(users: User, password: string): Promise<boolean> {
    try {
      const res = compareSync(password, users.password);
      return res;
    } catch (error) {
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async checkPasswordUpdate(users: User, password?: string): Promise<boolean> {
    if (!password) {
      return true;
    }
    const res = compareSync(password, users.password);
    return res;
  }

  // async updateUserData(updateUsersDTO: updateUsersDTO): Promise<User | null> {
  //   try {
  //     const { email, name, password, newPassword } = updateUsersDTO;
  //     const user = await this.userRepository.findOneBy({ email });
  //     console.log('el user', user);

  //     if (!user) {
  //       throw new HttpException(
  //         'no se encontro el usuario',
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }

  //     const res = await this.checkPasswordUpdate(user, password);
  //     if (!res) {
  //       throw new HttpException('Contraseña inválida', HttpStatus.BAD_REQUEST);
  //     }
  //     if (name) {
  //       user.name = name;
  //     }

  //     if (newPassword) {
  //       const salt = await bcrypt.genSalt(10);
  //       user.password = await bcrypt.hash(newPassword, salt);
  //     }

  //     const updatedUser = await this.userRepository.save(user);
  //     return updatedUser;
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOneBy({ email });

      if (!user) {
        return null;
      }
      const isPasswordValid = await this.checkPassword(user, password);

      if (!isPasswordValid) {
        return null;
      }
      return user;
    } catch (error) {
      if (error.status === HttpStatus.BAD_REQUEST) {
        throw error; // Propaga el error de BadRequest si proviene de checkPassword
      }
      throw new HttpException(`${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }
}
