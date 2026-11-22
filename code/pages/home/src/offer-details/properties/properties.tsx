import React from 'react';

import type { ProductFieldEntity } from '@library/domain';

import s from './default.module.css';
import { Property } from './property';

interface IProps {
  productFields: ProductFieldEntity[];
  variantFields: ProductFieldEntity[];
}

export const Properties: React.FC<IProps> = (props) => {
  return (
    <div className={s.fields}>
      {props.productFields.map((field) => (
        <Property key={`product:${field.propertyCode}`} field={field} />
      ))}
      {props.variantFields.map((field) => (
        <Property key={`variant:${field.propertyCode}`} field={field} />
      ))}
    </div>
  );
};
