'use client';

import React from 'react';

import { Card, Typography } from '@sellgar/kit';
import { BankCardLineIcon, TruckLineIcon } from '@sellgar/kit/icons';

import { ExpandableText } from '@library/design';
import type { CategoryPathEntity, StoreOfferEntity } from '@library/domain';

import { Brand } from './brand';
import { Categories } from './categories';
import s from './default.module.css';
import { Gallery } from './gallery';
import { Properties } from './properties';
import { Variants } from './variants';

interface IProps {
  offer?: StoreOfferEntity | null;
  siblingOffers: StoreOfferEntity[];
  categories: CategoryPathEntity[];
  failedToLoad?: boolean;
  purchase: React.ReactNode;
}

export const OfferDetailsComponent: React.FC<IProps> = (props) => {
  const [expandedDescriptionUuid, setExpandedDescriptionUuid] = React.useState<string | null>(null);

  if (props.failedToLoad || !props.offer) {
    return (
      <div className={s.page}>
        <Categories paths={[]} name="Предложение недоступно" />
        <Card>
          <div className={s.status}>
            <Typography size="h6" weight="semi-bold">
              <h1>{props.failedToLoad ? 'Не удалось загрузить предложение' : 'Предложение не найдено'}</h1>
            </Typography>
            <Typography size="body-s" weight="regular">
              <p>
                {props.failedToLoad
                  ? 'Попробуйте обновить страницу позже'
                  : 'На витрине нет такого активного предложения'}
              </p>
            </Typography>
          </div>
        </Card>
      </div>
    );
  }

  const offer = props.offer;
  const hasDescription = Boolean(offer.product.description || offer.variant.description);
  const hasProperties = offer.product.properties.length > 0 || offer.variant.properties.length > 0;

  return (
    <div className={s.page}>
      <header className={s.heading}>
        <Categories paths={props.categories} name={offer.product.name} />
        <Typography size="h5" weight="semi-bold">
          <h1 className={s.title}>{offer.product.name}</h1>
        </Typography>
      </header>
      <Card>
        <div className={s.overview}>
          <Gallery key={offer.uuid} images={offer.variant.images} name={offer.product.name} />
          <div className={s.info}>
            <div className={s.summary}>
              <div className={s.selection}>
                <Typography size="body-s" weight="semi-bold">
                  <p className={s.title}>{offer.variant.name}</p>
                </Typography>
              </div>
              {offer.brand ? <Brand name={offer.brand.name} imageUrl={offer.brand.images[0]?.imageUrl} /> : null}
            </div>
            {props.purchase}
            <section className={s.conditions} aria-label="Доставка и оплата">
              <div className={s.condition}>
                <span className={s.icon} aria-hidden={true}>
                  <TruckLineIcon />
                </span>
                <Typography size="caption-l" weight="regular">
                  <p className={s.paragraph}>Срок и стоимость доставки — при оформлении</p>
                </Typography>
              </div>
              <div className={s.condition}>
                <span className={s.icon} aria-hidden={true}>
                  <BankCardLineIcon />
                </span>
                <Typography size="caption-l" weight="regular">
                  <p className={s.paragraph}>Выбор способа оплаты — при оформлении</p>
                </Typography>
              </div>
            </section>
          </div>
        </div>
      </Card>
      {props.siblingOffers.length > 0 ? <Variants offers={props.siblingOffers} /> : null}
      {hasDescription || hasProperties ? (
        <Card>
          <section className={s.details} aria-label="О товаре">
            <Typography size="body-s" weight="semi-bold">
              <h2 className={s.title}>О товаре</h2>
            </Typography>
            {hasDescription ? (
              <section className={s.description} aria-label="Описание товара">
                <ExpandableText
                  key={offer.uuid}
                  open={expandedDescriptionUuid === offer.uuid}
                  onOpen={(open) => setExpandedDescriptionUuid(open ? offer.uuid : null)}
                >
                  <Typography size="caption-l" weight="regular">
                    {offer.product.description ? <p className={s.paragraph}>{offer.product.description}</p> : null}
                    {offer.variant.description && offer.variant.description !== offer.product.description ? (
                      <p className={s.paragraph}>{offer.variant.description}</p>
                    ) : null}
                  </Typography>
                </ExpandableText>
              </section>
            ) : null}
            {hasProperties ? (
              <section className={s.attributes} aria-label="Характеристики">
                <Properties productFields={offer.product.properties} variantFields={offer.variant.properties} />
              </section>
            ) : null}
          </section>
        </Card>
      ) : null}
    </div>
  );
};
