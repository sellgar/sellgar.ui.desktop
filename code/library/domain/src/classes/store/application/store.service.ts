import { Inject, Injectable } from '@sellgar/app';

import { StoreGatewayInterface } from '../data/gateway/store-gateway.interface.ts';
import type { StoreOfferDetailsEntity } from '../domain/store-offer-details.entity.ts';
import type { StoreOfferResultEntity } from '../domain/store-offer-result.entity.ts';
import { StoreServiceInterface } from './store-service.interface.ts';

@Injectable()
export class StoreService implements StoreServiceInterface {
  constructor(@Inject(StoreGatewayInterface) private readonly storeGateway: StoreGatewayInterface) {}

  getAll(
    brandCode?: string | string[],
    categoryUuid?: string | string[],
    signal?: AbortSignal,
    limit?: number,
    nextToken?: string,
  ): Promise<StoreOfferResultEntity> {
    return this.storeGateway.getAll(brandCode, categoryUuid, signal, limit, nextToken);
  }

  findOfferByUuid(uuid: string, signal?: AbortSignal): Promise<StoreOfferDetailsEntity> {
    return this.storeGateway.findOfferByUuid(uuid, signal);
  }
}
