import { Expose } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class BrandImageEntity {
  @Expose()
  @IsUUID()
  imageUuid: string;

  @Expose()
  @IsInt()
  sortOrder: number;

  @Expose()
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
