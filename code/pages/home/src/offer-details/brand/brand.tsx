import React from 'react';

import { ButtonLink, Image, Typography } from '@sellgar/kit';

import s from './default.module.css';

interface IProps {
  name: string;
  imageUrl?: string;
}

export const Brand: React.FC<IProps> = (props) => {
  return (
    <div className={s.wrapper}>
      <Typography size="caption-l" weight="regular">
        <span className={s.label}>Ещё от</span>
      </Typography>
      <ButtonLink
        type="button"
        size="sm"
        aria-label={`Все товары бренда ${props.name}`}
        aria-disabled={true}
        leadIconSizing="content"
        leadIcon={props.imageUrl ? <Image src={props.imageUrl} className={s.image} aria-hidden={true} /> : undefined}
      >
        {props.imageUrl ? null : <span className={s.name}>{props.name}</span>}
      </ButtonLink>
    </div>
  );
};
