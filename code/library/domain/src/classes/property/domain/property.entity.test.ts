import 'reflect-metadata';

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

import { UnitEntity } from '../../unit/index.ts';
import { PropertyEntity } from './property.entity.ts';

test('сохраняет код и отображаемое обозначение единицы из API без подмены значений', async () => {
  for (const unit of [null, { code: 'mm', name: 'Миллиметр', symbol: 'мм' }]) {
    const property = plainToInstance(
      PropertyEntity,
      {
        code: 'width',
        name: 'Ширина',
        description: null,
        kind: 'DECIMAL',
        unitCode: unit?.code ?? null,
        unit,
        options: [],
      },
      { excludeExtraneousValues: true },
    );

    await validateOrReject(property);
    assert.deepEqual(instanceToPlain(property).unit, unit);
    if (unit) assert.ok(property.unit instanceof UnitEntity);
  }
});
