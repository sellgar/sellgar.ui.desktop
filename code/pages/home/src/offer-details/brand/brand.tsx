import React from 'react';

import { Link } from '@sellgar/app/next';
import { Image, Typography } from '@sellgar/kit';

import s from './default.module.css';

interface IProps {
  name: string;
  imageUrl?: string;
  href: string;
}

export const Brand: React.FC<IProps> = (props) => {
  return (
    <div className={s.wrapper}>
      <Typography size="caption-l" weight="regular">
        <span className={s.label}>Ещё от</span>
      </Typography>
      <Link href={props.href} className={s.link} aria-label={`Все товары бренда ${props.name}`}>
        {props.imageUrl ? (
          <Image src={props.imageUrl} className={s.image} aria-hidden={true} />
        ) : (
          <Typography size="caption-l" weight="medium">
            <span className={s.name}>{props.name}</span>
          </Typography>
        )}
      </Link>
    </div>
  );
};
