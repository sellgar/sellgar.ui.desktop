import { Expose } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength, ValidateIf } from 'class-validator';

export class StoreQueryDto {
  @Expose()
  @ValidateIf((_object, value) => value !== undefined)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(256, { each: true })
  brandCode?: string | string[];

  @Expose()
  @ValidateIf((_object, value) => value !== undefined)
  @IsUUID(undefined, { each: true })
  categoryUuid?: string | string[];

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(8192)
  nextToken?: string;
}
