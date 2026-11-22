import type { StoreOfferDetailsEntity } from '../domain/store-offer-details.entity.ts';
import type { StoreOfferResultEntity } from '../domain/store-offer-result.entity.ts';

export abstract class StoreServiceInterface {
  abstract getAll(
    brandCode?: string | string[],
    categoryUuid?: string | string[],
    signal?: AbortSignal,
    limit?: number,
    nextToken?: string,
  ): Promise<StoreOfferResultEntity>;

  abstract findOfferByUuid(uuid: string, signal?: AbortSignal): Promise<StoreOfferDetailsEntity>;
}
