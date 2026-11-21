import type { ConfigInterface } from '../../../../../infrastructure/config/config.interface.ts';
import type { ProductFieldEntity } from '../../../../product/index.ts';
import type { StoreOfferEntity } from '../../../domain/store-offer.entity.ts';

export class StoreOfferMapper {
  static toOffer(offer: StoreOfferEntity, config: Pick<ConfigInterface, 'getImageUrl'>): StoreOfferEntity {
    return {
      ...offer,
      product: { ...offer.product, properties: this.toFields(offer.product.properties, config) },
      variant: {
        ...offer.variant,
        properties: this.toFields(offer.variant.properties, config),
        images: [...offer.variant.images]
          .sort((left, right) => left.order - right.order)
          .map((image) => ({
            ...image,
            imageUrl: config.getImageUrl(image.imageUuid, image.imageUrl),
          })),
      },
      records: offer.records.map((record) => ({
        ...record,
        clarifications: [...record.clarifications].sort((left, right) => left.position - right.position),
      })),
    };
  }

  private static toFields(
    fields: ProductFieldEntity[],
    config: Pick<ConfigInterface, 'getImageUrl'>,
  ): ProductFieldEntity[] {
    return [...fields]
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((field) => ({
        ...field,
        property: {
          ...field.property,
          options: field.property.options.map((option) => ({
            ...option,
            extras: [...option.extras]
              .sort((left, right) => left.sortOrder - right.sortOrder)
              .map((extra) => ({
                ...extra,
                imageUrl: extra.type === 'IMAGE' && extra.imageUuid ? config.getImageUrl(extra.imageUuid) : undefined,
              })),
          })),
        },
      }));
  }
}
