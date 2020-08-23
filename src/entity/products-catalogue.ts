import { SKU } from '../lib/enums';
import Item from './item';

export default class ProductsCatalogue {
  private static _items: Item[] = [];

  static setProductsCatalogue(items: Item[]) {
    this._items = items;
  }

  static getProduct(sku: SKU) {
    const items = this._items;

    const item = items.find(v => v.sku === sku);
    if (!item) {
      throw new Error('Not Found');
    }

    return new Item(item);
  }
}
