import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/interfaces/role.enum';
import { updateProjectDto } from './dto/update-project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  @Auth(Role.Admin)
  async create(@Body() createProjectDto: CreateProjectDto) {
    const user = await this.projectService.create(createProjectDto);
    console.log(user);

    return user;
  }

  @Get()
  async getProject() {
    const projects = await this.projectService.get();
    console.log(projects);

    return projects;
  }
  @Delete(':id')
  async removesSkill(@Param('id') id: string) {
    const project = await this.projectService.deleteSkill(id);
    console.log(project);

    return project;
  }
  @Get(':id')
  async getProyect(@Param('id') id: string) {
    const project = await this.projectService.getOneProject(id);
    return project;
  }
  @Patch(':id')
  async Update(@Param('id') id: string,@Body() projectEdit: updateProjectDto) {
    return await this.projectService.EditProject(id, projectEdit); 
  }
}
