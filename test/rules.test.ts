import {
  BuyNPayForMDealRule,
  BulkBuyFlatDiscountRule,
  BundleDiscountRule,
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
  const mbp = () =>
    new Item({
      sku: SKU.MBP,
      name: 'MacBook Pro',
      priceCents: 139999,
    });
  const ipd = () =>
    new Item({
      sku: SKU.IPD,
      name: 'Super iPad',
      priceCents: 54999,
    });
  const vga = () =>
    new Item({
      sku: SKU.VGA,
      name: 'VGA adapter',
      priceCents: 3000,
    });

  const buyNPayForMDealRule = new BuyNPayForMDealRule({
    sku: SKU.ATV,
    buyQuantity: 3,
    payQuantity: 2,
  });
  const bulkBuyFlatDiscountRule = new BulkBuyFlatDiscountRule({
    sku: SKU.IPD,
    numberOfUnits: 4,
    discountedPriceCents: 49999,
  });
  const bundleDiscountRule = new BundleDiscountRule({
    buySku: SKU.MBP,
    buyQuantity: 1,
    freeSku: SKU.VGA,
    freeQuantity: 1,
  });

  it('Buy N pay for only M Deal Rule', () => {
    const items = [atv(), atv(), atv(), atv(), atv(), atv()];
    const discountedItems = buyNPayForMDealRule.updateItemsPrice(items);

    const zeroAtv = () =>
      new Item({
        sku: SKU.ATV,
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

  it('More than N items flat Bulk Discount Rule: Less or equal to than 4 iPads', () => {
    const items = [ipd(), ipd(), ipd(), ipd()];
    const discountedItems = bulkBuyFlatDiscountRule.updateItemsPrice(items);

    expect(discountedItems).toEqual([ipd(), ipd(), ipd(), ipd()]);
  });

  it('More than N items flat Bulk Discount Rule: more than 4 iPads', () => {
    const items = [ipd(), ipd(), ipd(), ipd(), ipd(), ipd()];
    const discountedItems = bulkBuyFlatDiscountRule.updateItemsPrice(items);

    const changedIpd = () =>
      new Item({
        sku: SKU.IPD,
        name: 'Super iPad',
        priceCents: 49999,
      });
    expect(discountedItems).toEqual([
      changedIpd(),
      changedIpd(),
      changedIpd(),
      changedIpd(),
      changedIpd(),
      changedIpd(),
    ]);
  });

  it('Bundle Discount Rule: Add free items, if not in cart', () => {
    const items = [mbp(), mbp()];
    const discountedItems = bundleDiscountRule.updateItemsPrice(items);

    const freeVga = () =>
      new Item({
        sku: SKU.VGA,
        name: 'VGA adapter',
        priceCents: 0,
      });

    expect(discountedItems).toEqual([mbp(), mbp(), freeVga(), freeVga()]);
  });

  it('Bundle Discount Rule: Override free items price, if already exists in cart', () => {
    const items = [mbp(), mbp(), vga(), vga(), vga(), vga()];
    const discountedItems = bundleDiscountRule.updateItemsPrice(items);

    const freeVga = () =>
      new Item({
        sku: SKU.VGA,
        name: 'VGA adapter',
        priceCents: 0,
      });

    expect(discountedItems).toEqual([
      mbp(),
      mbp(),
      freeVga(),
      freeVga(),
      vga(),
      vga(),
    ]);
  });

  it('Bundle Discount Rule: On 3 Mac 2 Vga free, Override free items price, if already exists in cart', () => {
    const bundleDiscountRule = new BundleDiscountRule({
      buySku: SKU.MBP,
      buyQuantity: 3,
      freeSku: SKU.VGA,
      freeQuantity: 2,
    });

    const items = [mbp(), mbp(), mbp(), vga(), vga(), vga(), vga()];
    const discountedItems = bundleDiscountRule.updateItemsPrice(items);

    const freeVga = () =>
      new Item({
        sku: SKU.VGA,
        name: 'VGA adapter',
        priceCents: 0,
      });

    expect(discountedItems).toEqual([
      mbp(),
      mbp(),
      mbp(),
      freeVga(),
      freeVga(),
      vga(),
      vga(),
    ]);
  });
});
