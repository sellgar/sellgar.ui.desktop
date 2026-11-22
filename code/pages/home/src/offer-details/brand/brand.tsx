import React from 'react';

import { Image, Typography } from '@sellgar/kit';

import s from './default.module.css';

interface IProps {
  name: string;
  imageUrl?: string;
}

export const Brand: React.FC<IProps> = (props) => {
  return (
    <Typography size="body-s" weight="medium">
      <div className={s.wrapper}>
        <span>{props.name}</span>
        {props.imageUrl ? <Image src={props.imageUrl} className={s.image} aria-hidden={true} /> : null}
      </div>
    </Typography>
  );
};
