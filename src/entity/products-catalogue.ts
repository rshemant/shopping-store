import { SKU } from '../lib/enums';
import Item from './item';

export default class ProductsCatalogue {
  // this latter will move to data file
  private static _items = [
    new Item({ sku: SKU.IPD, name: 'Super iPad', priceCents: 54999 }),
    new Item({ sku: SKU.IPD, name: 'MacBook Pro', priceCents: 139999 }),
    new Item({ sku: SKU.IPD, name: 'Apple TV', priceCents: 10950 }),
    new Item({ sku: SKU.VGA, name: 'VGA adapter', priceCents: 3000 }),
  ];

  static getItem(sku: SKU) {
    const items = ProductsCatalogue._items;

    const item = items.find(v => v.sku === sku);
    if (!item) {
      throw new Error('Not Found');
    }

    return new Item(item);
  }
}
