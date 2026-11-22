import React from 'react';

import { Typography } from '@sellgar/kit';

import type { ProductFieldEntity } from '@library/domain';

import s from './default.module.css';
import { ExtraFactory } from './extra-factory';
import { formatPropertyValue } from './formatter/property-value.formatter.ts';

interface IProps {
  field: ProductFieldEntity;
}

export const Property: React.FC<IProps> = (props) => {
  const options = props.field.property.options;

  return (
    <div className={s.wrapper}>
      <Typography size="caption-m" weight="regular">
        <div className={s.label}>{props.field.property.name}</div>
      </Typography>
      <div className={s.leader} aria-hidden="true" />
      <Typography size="caption-m" weight="semi-bold">
        <div className={s.values}>
          {props.field.values.length === 0 ? (
            <span>Не указано</span>
          ) : props.field.property.kind === 'OPTIONS' ? (
            <span>
              {props.field.values
                .filter((value) => value.valueOptionCode !== null)
                .map((value, index) => {
                  const option = options.find((item) => item.code === value.valueOptionCode);

                  return (
                    <React.Fragment key={value.valueOptionCode}>
                      {index > 0 ? ', ' : null}
                      <span className={s.option}>
                        {option?.extras.map((extra) => (
                          <ExtraFactory key={`${extra.type}:${extra.sortOrder}`} extra={extra} />
                        ))}
                        <span>{option?.name ?? 'Значение недоступно'}</span>
                      </span>
                    </React.Fragment>
                  );
                })}
            </span>
          ) : (
            <span>
              {props.field.values
                .map((value) => formatPropertyValue(props.field.property.kind, value))
                .filter((value) => value !== '')
                .join(', ') || 'Не указано'}
            </span>
          )}
          {props.field.property.unit ? (
            <span className={s.unit}>
              {'\u00a0'}
              {props.field.property.unit.symbol}
            </span>
          ) : null}
        </div>
      </Typography>
    </div>
  );
};
