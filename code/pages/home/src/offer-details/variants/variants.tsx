import React from 'react';

import { Typography } from '@sellgar/kit';

import type { StoreOfferEntity } from '@library/domain';

import s from './default.module.css';
import { Variant } from './variant';

interface IProps {
  offers: StoreOfferEntity[];
}

export const Variants: React.FC<IProps> = (props) => {
  return (
    <nav id="related-offers" className={s.wrapper} aria-label="Связанные предложения" tabIndex={-1}>
      <Typography size="body-s" weight="semi-bold">
        <h2 className={s.title}>Смотрите также</h2>
      </Typography>
      <div className={s.items}>
        {props.offers.map((offer) => (
          <Variant key={offer.uuid} offer={offer} />
        ))}
      </div>
    </nav>
  );
};
