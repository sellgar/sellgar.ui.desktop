import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

import { Entity } from '@sellgar/app';

@Entity({ identity: 'code' })
export class UnitEntity {
  @Expose()
  @IsString()
  code: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  symbol: string;
}
