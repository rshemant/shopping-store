import { BuyNPayForMDealRule } from '../src/entity/rules';
import Item from '../src/entity/item';
import { SKU } from '../src/lib/enums';

describe('Rule Test', () => {
  const atv = () =>
    new Item({
      sku: SKU.ATV,
      name: 'Apple TV',
      priceCents: 10950,
    });

  const buyNPayForMDealRule = new BuyNPayForMDealRule({
    sku: SKU.ATV,
    buyQuantity: 3,
    payQuantity: 2,
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
});
