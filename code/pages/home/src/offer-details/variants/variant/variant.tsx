import React from 'react';

import { ProductCard } from '@library/design';
import type { StoreOfferEntity } from '@library/domain';

import { formatPrice, getInitials, getPreviewImage } from '../../../formatter/offer.formatter.ts';

interface IProps {
  offer: StoreOfferEntity;
}

export const Variant: React.FC<IProps> = (props) => {
  const image = getPreviewImage(props.offer);

  return (
    <ProductCard
      size="compact"
      href={`/offers/${props.offer.uuid}`}
      name={props.offer.product.name}
      variantName={props.offer.variant.name}
      imageUrl={image?.imageUrl}
      imagePlaceholder={getInitials(props.offer.product.name)}
      price={formatPrice(props.offer)}
    />
  );
};
