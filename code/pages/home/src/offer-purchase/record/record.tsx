'use client';

import React from 'react';

import { Button, QuantityStepper, ToolTip, Typography } from '@sellgar/kit';
import { InformationLineIcon, ShoppingCart2LineIcon } from '@sellgar/kit/icons';

import type { CartItemEntity, StoreAccountingRecordEntity } from '@library/domain';

import { formatRecordPrice, getClarifications } from '../../formatter/offer.formatter.ts';
import s from './default.module.css';

interface IProps {
  record: StoreAccountingRecordEntity;
  item?: CartItemEntity;
  loaded: boolean;
  busy?: boolean;
  disabled?: boolean;
  loading?: boolean;
  pendingAction?: 'increase' | 'decrease' | null;
  onChange?: (recordUuid: string, quantity: number) => void;
}

export const Record: React.FC<IProps> = (props) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const counterRef = React.useRef<HTMLDivElement>(null);
  const focusAfterChange = React.useRef(false);
  const clarifications = getClarifications(props.record).join(' · ');
  const name = clarifications || props.record.article;
  const quantity = props.item?.quantity ?? 0;
  const canIncrease =
    props.loaded &&
    !props.disabled &&
    !props.busy &&
    !!props.record.currentPrice &&
    (props.item?.canIncrease ?? props.record.inventory.available > 0);
  const canDecrease =
    !props.disabled && !props.busy && props.item
      ? quantity === 1
        ? props.item.canRemove
        : props.item.canDecrease
      : false;
  const change = (value: number) => {
    if (!props.busy) {
      focusAfterChange.current = true;
      props.onChange?.(props.record.uuid, value);
    }
  };

  React.useLayoutEffect(() => {
    if (!focusAfterChange.current) return;

    (quantity > 0 ? counterRef.current : buttonRef.current)?.focus();
    focusAfterChange.current = false;
  }, [quantity]);

  return (
    <div className={s.wrapper} role="group" aria-label={name}>
      {clarifications ? (
        <div className={s.details}>
          <Typography size="caption-l" weight="medium">
            <p className={s.name}>{clarifications}</p>
          </Typography>
        </div>
      ) : null}
      <Typography size="body-s" weight="semi-bold">
        <p className={s.price}>{formatRecordPrice(props.record)}</p>
      </Typography>
      <div className={s.action}>
        <div className={s.control}>
          {quantity > 0 ? (
            <div
              ref={counterRef}
              className={s.counter}
              role="spinbutton"
              tabIndex={0}
              aria-label={`Количество ${name} в корзине`}
              aria-valuenow={quantity}
              aria-valuemin={0}
              aria-valuemax={Math.max(quantity, props.record.inventory.available)}
              aria-disabled={props.busy || (!canIncrease && !canDecrease)}
              aria-busy={props.loading}
              onKeyDown={(event) => {
                if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                  event.preventDefault();
                  if (event.key === 'ArrowUp' && canIncrease) change(quantity + 1);

                  if (event.key === 'ArrowDown' && canDecrease) change(quantity - 1);
                }
              }}
            >
              <QuantityStepper
                size="md"
                outline={true}
                value={quantity}
                loadingAction={props.loading ? (props.pendingAction === 'decrease' ? 'left' : 'right') : undefined}
                leftActionType="subtract"
                leftActionDisabled={!canDecrease}
                rightActionDisabled={!canIncrease}
                onLeftActionClick={() => {
                  if (canDecrease) change(quantity - 1);
                }}
                onRightActionClick={() => {
                  if (canIncrease) change(quantity + 1);
                }}
              />
            </div>
          ) : (
            <Button
              ref={buttonRef}
              type="button"
              size="sm"
              style="secondary"
              target="default"
              leadIcon={<ShoppingCart2LineIcon />}
              disabled={!canIncrease}
              inProcess={props.loading}
              aria-label={`${name}. Добавить в корзину`}
              aria-busy={props.loading}
              onClick={() => {
                if (canIncrease) change(1);
              }}
            >
              В корзину
            </Button>
          )}
        </div>
        <ToolTip placement="top" size="sm">
          <ToolTip.Trigger>
            <Button.Icon
              type="button"
              size="xs"
              style="ghost"
              leadIcon={<InformationLineIcon />}
              aria-label={`Артикул: ${props.record.article}`}
            />
          </ToolTip.Trigger>
          <ToolTip.Content>
            <ToolTip.Content.Label>Артикул</ToolTip.Content.Label>
            <ToolTip.Content.Caption>{props.record.article}</ToolTip.Content.Caption>
          </ToolTip.Content>
        </ToolTip>
      </div>
    </div>
  );
};
