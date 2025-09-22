import { NotFoundException } from '@nestjs/common';

export function checkExists<T>(
  value: T | null | undefined,
  message: string,
): T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
  return value;
}

export function checkFound<T>(value: T | null | undefined, message: string): T {
  if (value === null || value === undefined) {
    throw new NotFoundException(message);
  }
  return value;
}
