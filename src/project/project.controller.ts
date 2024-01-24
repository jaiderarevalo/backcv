import { Controller, Post, Body } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/interfaces/role.enum';

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
}
