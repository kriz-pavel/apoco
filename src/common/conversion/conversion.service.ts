import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversionServiceService {
  convertIdToPokedexIdString(id: number): string {
    return id.toString().padStart(3, '0');
  }

  convertGramsToKilogramsString(grams: number): string {
    return `${grams / 1000}kg`;
  }

  convertCmToMetrsString(cm: number): string {
    return `${cm / 100}m`;
  }
}
