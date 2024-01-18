import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from 'src/interfaces/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {} //para acceder a los metadatos  se usa el reflector alos roles = user etc.. osea el key y el value osea el "roles" = "admin" o "user" etc..
  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      // para leeer los metadata
      context.getHandler(),
      context.getClass(),
    ]);
    if (!role) {
      return true;
    }
    console.log(role);
    const { user } = context.switchToHttp().getRequest();
    return role === user.role;   // si se va a hacer varios roles se  compara con array en la documentacion esta se mapea
  }
}
