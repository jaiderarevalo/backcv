import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createProject: CreateProjectDto): Promise<Project> {
    try {
      console.log('lo que llega', createProject);
      const res = this.projectRepository.save({
        name: createProject.name,
        description: createProject.description,
        skills: createProject.skills,
        image: createProject.image,
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
}
