import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { EntityType } from "../decorators/entity_type.decorator";

@Injectable()
export class EntityTypeGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    
    canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const user_types = this.reflector.get(EntityType, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user_types.includes(user.entity.code)) {
      return false;
    }
    return true;
  }
}