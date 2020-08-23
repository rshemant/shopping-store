import {
  Rule,
  BuyNPayForMDealRule,
  BulkBuyFlatDiscountRule,
  BundleDiscountRule,
} from '../src/entity/rules';
import Checkout from '../src/entity/checkout';
import Item from '../src/entity/item';
import { SKU } from '../src/lib/enums';
import ProductsCatalogue from '../src/entity/products-catalogue';

describe('Checkout Test', () => {
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

  ProductsCatalogue.setProductsCatalogue([atv(), mbp(), ipd(), vga()]);

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

  const rules: Rule[] = [
    buyNPayForMDealRule,
    bulkBuyFlatDiscountRule,
    bundleDiscountRule,
  ];

  it('SKUs Scanned: atv, atv, atv, vga Total expected: $249.00', () => {
    const checkout = new Checkout({ rules });
    checkout.scan(atv());
    checkout.scan(atv());
    checkout.scan(atv());
    checkout.scan(vga());

    expect(checkout.total()).toEqual('$249.00');
  });

  it('SKUs Scanned: atv, ipd, ipd, atv, ipd, ipd, ipd Total expected: $2718.95', () => {
    const checkout = new Checkout({ rules });
    checkout.scan(atv());
    checkout.scan(ipd());
    checkout.scan(ipd());
    checkout.scan(atv());
    checkout.scan(ipd());
    checkout.scan(ipd());
    checkout.scan(ipd());

    expect(checkout.total()).toEqual('$2718.95');
  });

  it('SKUs Scanned: mbp, vga, ipd Total expected: $1949.98', () => {
    const checkout = new Checkout({ rules });
    checkout.scan(mbp());
    checkout.scan(vga());
    checkout.scan(ipd());

    expect(checkout.total()).toEqual('$1949.98');
  });
});
