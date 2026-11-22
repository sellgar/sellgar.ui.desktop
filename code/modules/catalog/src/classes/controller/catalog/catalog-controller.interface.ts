import type { ControllerArgs, RuntimeController, WithProps } from '@sellgar/app';

import type { CatalogResultEntity } from './domain/catalog-result.entity.ts';
import type { CatalogPropsInput } from './input/catalog-props.input.ts';

export abstract class CatalogControllerInterface implements RuntimeController {
  abstract loader(args: ControllerArgs<WithProps<CatalogPropsInput>>): Promise<CatalogResultEntity>;
}
