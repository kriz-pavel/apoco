import { Global, Module } from '@nestjs/common';
import { PreconditionsService } from './preconditions/preconditions.service';
import { ConversionServiceService } from './conversion/conversion.service';

@Global()
@Module({
  providers: [PreconditionsService, ConversionServiceService],
  exports: [PreconditionsService, ConversionServiceService],
})
export class CommonModule {}
