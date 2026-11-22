import 'reflect-metadata';

import assert from 'node:assert/strict';
import { afterEach, mock, test } from 'node:test';
import type { StoreServiceInterface } from '@library/domain';

import {
  createStoreOffer,
  offerUuid,
} from '../../../../../../../library/domain/src/classes/store/data/gateway/__test__/store-offer.fixture.ts';
import { CatalogController } from '../catalog.controller.ts';

afterEach(() => mock.restoreAll());
test('catalog controller forwards its input to the service and serializes nested domain instances for SSR', async () => {
  const abort = new AbortController();
  let received: unknown[] = [];
  const offer = createStoreOffer();
  const service: StoreServiceInterface = {
    getAll: async (...args) => {
      received = args;

      return { items: [offer], meta: { limit: 50, nextToken: null } };
    },
    findOfferByUuid: async (...args) => {
      received = args;

      return { offer, siblingOffers: [offer] };
    },
  };
  const controller = new CatalogController(service);
  const result = await controller.loader({ signal: abort.signal, props: { searchParams: {} } });

  assert.equal(result.products[0].uuid, offerUuid);
  assert.equal(result.failedToLoad, false);
  assert.equal(Object.getPrototypeOf(result.products[0]), Object.prototype);
  assert.equal(Object.getPrototypeOf(result.products[0].records[0].inventory), Object.prototype);
  assert.deepEqual(received, [undefined, undefined, abort.signal]);
});
test('catalog controller owns the UI failure state and propagates cancellation', async () => {
  const abort = new AbortController();
  const service: StoreServiceInterface = {
    getAll: async () => {
      throw new Error('unavailable');
    },
    findOfferByUuid: async () => {
      throw new Error('unavailable');
    },
  };

  mock.method(console, 'error', () => {});
  const controller = new CatalogController(service);

  assert.deepEqual(await controller.loader({ signal: abort.signal, props: { searchParams: {} } }), {
    products: [],
    failedToLoad: true,
    brandFiltered: false,
    categoryFiltered: false,
  });
  abort.abort();
  mock.method(service, 'getAll', async () => {
    throw abort.signal.reason;
  });
  await assert.rejects(controller.loader({ signal: abort.signal, props: { searchParams: {} } }), {
    name: 'AbortError',
  });
});

test('catalog validates brand codes from the URL and forwards them without filtering offers in UI', async () => {
  let received: unknown[] = [];
  const service: StoreServiceInterface = {
    getAll: async (...args) => {
      received = args;

      return { items: [], meta: { limit: 50, nextToken: null } };
    },
    findOfferByUuid: async () => {
      throw new Error('Unused');
    },
  };
  const controller = new CatalogController(service);
  const signal = new AbortController().signal;

  for (const brandCode of ['samsung', ['apple', 'samsung']]) {
    const result = await controller.loader({ signal, props: { searchParams: { brandCode } } });

    assert.deepEqual(received, [brandCode, undefined, signal]);
    assert.equal(result.brandFiltered, true);
    assert.equal(result.failedToLoad, false);
  }
  for (const brandCode of ['', null, ['apple', ''], { code: 'apple' }]) {
    await assert.rejects(controller.loader({ signal, props: { searchParams: { brandCode } } }));
  }
});

test('catalog validates category UUIDs and passes combined filters to the service before loading', async () => {
  let received: unknown[] = [];
  const service: StoreServiceInterface = {
    getAll: async (...args) => {
      received = args;

      return { items: [], meta: { limit: 50, nextToken: null } };
    },
    findOfferByUuid: async () => {
      throw new Error('Unused');
    },
  };
  const controller = new CatalogController(service);
  const signal = new AbortController().signal;
  const first = 'f7959bed-68ee-4943-bc7d-31165e6c85a4';
  const second = 'dd0cdf36-6737-46fe-bb8f-f72a7ae824bd';

  for (const categoryUuid of [first, [first, second]]) {
    const result = await controller.loader({ signal, props: { searchParams: { categoryUuid, brandCode: 'nike' } } });

    assert.deepEqual(received, ['nike', categoryUuid, signal]);
    assert.equal(result.categoryFiltered, true);
    assert.equal(result.brandFiltered, true);
    assert.equal(result.failedToLoad, false);
  }
  const getAll = mock.method(service, 'getAll');

  for (const categoryUuid of ['', 'bad', null, [first, 'bad'], { uuid: first }]) {
    await assert.rejects(controller.loader({ signal, props: { searchParams: { categoryUuid } } }));
  }
  assert.equal(getAll.mock.callCount(), 0);
});
