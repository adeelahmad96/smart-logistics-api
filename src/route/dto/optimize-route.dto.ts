import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

class ConstraintsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  avoidHighways?: boolean;
}

export class OptimizeRouteDto {
  @ApiProperty()
  @IsString()
  originNodeId: string;

  @ApiProperty()
  @IsString()
  destinationNodeId: string;

  @ApiPropertyOptional({ enum: ['shortest', 'fastest'], default: 'shortest' })
  @IsOptional()
  @IsEnum(['shortest', 'fastest'])
  preference?: 'shortest' | 'fastest';

  @ApiPropertyOptional({ type: ConstraintsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ConstraintsDto)
  constraints?: ConstraintsDto;
}
