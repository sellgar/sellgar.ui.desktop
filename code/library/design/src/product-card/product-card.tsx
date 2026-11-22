import cn from 'classnames';
import React from 'react';

import { Link } from '@sellgar/app/next';
import { Badge, Typography } from '@sellgar/kit';

import { Image } from '../image';
import s from './default.module.css';

interface IProps {
  href: string;
  name: string;
  variantName: string;
  brandName?: string;
  imageUrl?: string;
  imagePlaceholder: string;
  price: string;
  size?: 'default' | 'compact';
}

export const ProductCard: React.FC<IProps> = (props) => {
  const linkLabel = [props.name, props.brandName, props.variantName].filter(Boolean).join(' · ');
  const isCompact = props.size === 'compact';
  const wrapperClassName = cn(s.wrapper, {
    [s['size--compact']]: isCompact,
  });
  const TitleTag = isCompact ? 'h3' : 'h2';
  const price = (
    <Typography size={isCompact ? 'caption-l' : 'body-s'} weight="semi-bold">
      <div>{props.price}</div>
    </Typography>
  );

  const preview = props.imageUrl ? (
    <div className={s.image}>
      <Image src={props.imageUrl} sizes={isCompact ? '80px' : '192px'} alt="" aria-hidden={true} />
    </div>
  ) : (
    <Typography size="body-l" weight="medium">
      <span aria-hidden={true}>{props.imagePlaceholder}</span>
    </Typography>
  );

  return (
    <Link className={wrapperClassName} href={props.href} aria-label={linkLabel}>
      <div className={s.preview}>{preview}</div>
      <div className={s.body}>
        {props.brandName ? (
          <Typography size="caption-m" weight="regular">
            <div className={s.brand}>{props.brandName}</div>
          </Typography>
        ) : null}
        {!isCompact ? price : null}
        <Typography size="caption-m" weight="regular">
          <TitleTag className={s.title}>
            <span className={s.name} title={isCompact ? props.name : undefined}>
              {props.name}
            </span>
          </TitleTag>
        </Typography>
        {isCompact ? (
          <Typography size="caption-m" weight="regular">
            <div className={s.variant}>{props.variantName}</div>
          </Typography>
        ) : (
          <div className={s.personalizations}>
            <Badge label={props.variantName} size="sm" color="blue" />
          </div>
        )}
        {isCompact ? price : null}
      </div>
    </Link>
  );
};
