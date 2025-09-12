import { Injectable } from '@nestjs/common';

@Injectable()
export class PreconditionsService {
  checkExists<T>(value: T | null | undefined, message: string): T {
    if (value === null || value === undefined) {
      throw new Error(message);
    }
    return value;
  }
}
