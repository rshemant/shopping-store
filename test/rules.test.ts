import {
  BuyNPayForMDealRule,
  BulkBuyFlatDiscountRule,
} from '../src/entity/rules';
import Item from '../src/entity/item';
import { SKU } from '../src/lib/enums';

describe('Rule Test', () => {
  const atv = () =>
    new Item({
      sku: SKU.ATV,
      name: 'Apple TV',
      priceCents: 10950,
    });
  const ipd = () =>
    new Item({
      sku: 'ipd',
      name: 'Super iPad',
      priceCents: 54999,
    });

  const buyNPayForMDealRule = new BuyNPayForMDealRule({
    sku: SKU.ATV,
    buyQuantity: 3,
    payQuantity: 2,
  });
  const bulkBuyFlatDiscountRule = new BulkBuyFlatDiscountRule({
    sku: 'ipd',
    numberOfUnits: 4,
    discountedPriceCents: 49999,
  });

  it('Buy N pay for only M Deal Rule', () => {
    const items = [atv(), atv(), atv(), atv(), atv(), atv()];
    const discountedItems = buyNPayForMDealRule.updateItemsPrice(items);

    const zeroAtv = () =>
      new Item({
        sku: 'atv',
        name: 'Apple TV',
        priceCents: 0,
      });

    expect(discountedItems).toEqual([
      atv(),
      atv(),
      zeroAtv(),
      atv(),
      atv(),
      zeroAtv(),
    ]);
  });

  it('More than N items flat Bulk Discount Rule', () => {
    const items = [ipd(), ipd(), ipd(), ipd(), ipd(), ipd()];
    const discountedItems = bulkBuyFlatDiscountRule.updateItemsPrice(items);

    const changedIpd = () =>
      new Item({
        sku: 'ipd',
        name: 'Super iPad',
        priceCents: 49999,
      });
    expect(discountedItems).toEqual([
      ipd(),
      ipd(),
      ipd(),
      ipd(),
      changedIpd(),
      changedIpd(),
    ]);
  });
});
