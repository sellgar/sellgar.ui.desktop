import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

import { Controller, Inject } from '@sellgar/app';

import { StoreServiceInterface } from '@library/domain';

import { CatalogControllerInterface } from './catalog-controller.interface.ts';
import { CatalogResultEntity } from './domain/catalog-result.entity.ts';
import { CatalogQueryDto } from './dto/catalog-query.dto.ts';

@Controller()
export class CatalogController implements CatalogControllerInterface {
  constructor(@Inject(StoreServiceInterface) private readonly storeService: StoreServiceInterface) {}

  async loader(args: Parameters<CatalogControllerInterface['loader']>[0]): Promise<CatalogResultEntity> {
    const query = plainToInstance(CatalogQueryDto, args.props.searchParams, { excludeExtraneousValues: true });

    await validateOrReject(query);
    const brandFiltered = query.brandCode !== undefined;

    try {
      const result = await this.storeService.getAll(query.brandCode, args.signal);

      return this.toResult({ products: result.data, failedToLoad: false, brandFiltered });
    } catch (error) {
      if (args.signal?.aborted) throw error;

      console.error('Unable to load storefront catalog', error);

      return this.toResult({ products: [], failedToLoad: true, brandFiltered });
    }
  }

  private async toResult(value: CatalogResultEntity): Promise<CatalogResultEntity> {
    const result = plainToInstance(CatalogResultEntity, value);

    await validateOrReject(result);

    return instanceToPlain(result) as CatalogResultEntity;
  }
}
