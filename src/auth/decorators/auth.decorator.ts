import { UseGuards, applyDecorators } from '@nestjs/common';
import { Role } from 'src/interfaces/role.enum';
import { Roles } from './roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guard/roles.guard';

export function Auth(role: Role) {
  return applyDecorators(
    // junta todos los decoradores  para  que encima del post etc... solo sea un decorador
    Roles(role),
    UseGuards(AuthGuard('jwt'), RolesGuard),
  );
}
