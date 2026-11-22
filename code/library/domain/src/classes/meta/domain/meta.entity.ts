import { Expose } from 'class-transformer';
import { IsInt, IsString, Min, Max, MinLength, ValidateIf } from 'class-validator';

export class MetaEntity {
  @Expose()
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number;

  @Expose()
  @ValidateIf((_object, value) => value !== null)
  @IsString()
  @MinLength(1)
  nextToken: string | null;
}
