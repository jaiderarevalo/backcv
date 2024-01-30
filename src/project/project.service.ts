import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { updateProjectDto } from './dto/update-project.dto';

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
        repository: createProject.repository,
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

  async get() {
    try {
      const response = await this.projectRepository.find();
      if (!response) {
        throw new HttpException(
          'no se pudo obtener los proyectos',
          HttpStatus.BAD_REQUEST,
        );
      }
      return response;
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteSkill(id: string): Promise<Project | null> {
    // Buscar la habilidad por ID
    const project = await this.projectRepository.findOneBy({ id });

    // Si no se encuentra la habilidad, lanzar una excepción NotFoundException
    if (!project) {
      throw new NotFoundException('Habilidad no encontrada');
    }

    // Eliminar la habilidad
    await this.projectRepository.remove(project);

    return project; // Devuelve la habilidad eliminada si es necesario
  }

  async getOneProject(id: string): Promise<Project | null> {
    // Buscar la habilidad por ID
    const project = await this.projectRepository.findOneBy({ id });

    // Si no se encuentra la habilidad, lanzar una excepción NotFoundException
    if (!project) {
      throw new NotFoundException('proyecto no encontrado');
    }
    return project; // Devuelve la habilidad eliminada si es necesario
  }
  async EditProject(id: string, updateProject: updateProjectDto) {
    console.log();

    try {
      const res = await this.projectRepository.update(id, {
        name: updateProject.name,
        description: updateProject.description,
        skills: updateProject.skills,
        repository: updateProject.repository,
        image: updateProject.image,
      });
      if (!res) {
        throw new HttpException(
          'No se pudo actualizar',
          HttpStatus.BAD_REQUEST,
        );
      }
      const projecto = await this.projectRepository.findOne({ where: { id } });
      return projecto;
      // Aquí se devuelve la instancia de User
    } catch (error) {
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
