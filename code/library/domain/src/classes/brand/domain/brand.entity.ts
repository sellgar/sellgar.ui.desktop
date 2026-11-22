import { Expose, Type } from 'class-transformer';
import { IsArray, IsString, ValidateIf, ValidateNested } from 'class-validator';

import { Entity } from '@sellgar/app';

import { BrandImageEntity } from './brand-image.entity.ts';

@Entity({ identity: 'code' })
export class BrandEntity {
  @Expose()
  @IsString()
  code: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @ValidateIf((_object, value) => value !== null)
  @IsString()
  description: string | null;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BrandImageEntity)
  images: BrandImageEntity[];
}
