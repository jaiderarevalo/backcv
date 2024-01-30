import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { Role } from 'src/interfaces/role.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post('create')
  @Auth(Role.Admin)
  async create(@Body() createProjectDto: CreateSkillDto) {
    const user = await this.skillsService.createImageSkill(createProjectDto);
    console.log(user);
    return user;
  }
  @Get()
  async getProject() {
    const skilluser = await this.skillsService.get();
    console.log(skilluser);

    return skilluser;
  }
  @Delete(':id')
  async removesSkill(@Param('id') id: string) {
    const skilluser = await this.skillsService.deleteSkill(id);
    console.log(skilluser);

    return skilluser;
  }
}
