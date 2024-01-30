import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly CreateSkill: Repository<Skill>,
  ) {}

  async createImageSkill(createSkill: CreateSkillDto): Promise<Skill> {
    try {
      console.log('lo que llega de skill', createSkill);
      const res = this.CreateSkill.save({
        skill: createSkill.skill,
      });
      if (!res) {
        throw new HttpException(
          'No se pudo crear el proyecto',
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

  async get() {
    try {
      const response = await this.CreateSkill.find();
      if (!response) {
        throw new HttpException(
          'no se pudo obtener las habilidades',
          HttpStatus.BAD_REQUEST,
        );
      }
      return response;
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteSkill(id: string): Promise<Skill | null> {
    // Buscar la habilidad por ID
    const skill = await this.CreateSkill.findOneBy({ id });

    // Si no se encuentra la habilidad, lanzar una excepción NotFoundException
    if (!skill) {
      throw new NotFoundException('Habilidad no encontrada');
    }

    // Eliminar la habilidad
    await this.CreateSkill.remove(skill);

    return skill; // Devuelve la habilidad eliminada si es necesario
  }
}
