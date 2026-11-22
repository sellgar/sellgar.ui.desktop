import { Expose } from 'class-transformer';
import { IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';

export class CatalogQueryDto {
  @Expose()
  @ValidateIf((_object, value) => value !== undefined)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(256, { each: true })
  brandCode?: string | string[];
}
