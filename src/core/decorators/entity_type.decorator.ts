
import { Reflector } from '@nestjs/core';

export const EntityType = Reflector.createDecorator<string[]>();
