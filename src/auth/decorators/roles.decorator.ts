import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/interfaces/role.enum';
export const ROLES_KEY = 'roles';
export const Roles = (role: Role) => SetMetadata(ROLES_KEY, role);
