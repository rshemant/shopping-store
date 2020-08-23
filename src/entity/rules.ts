import Item from '../entity/item';
import ItemCatalog from './products-catalogue';
import { SKU } from '../lib/enums';

export abstract class Rule {
  abstract updateItemsPrice(items: Item[]): Item[];
}

interface BuyNPayForMDealRuleProp {
  sku: SKU;
  buyQuantity: number;
  payQuantity: number;
}

// We're going to have a 3 for 2 deal on Apple TVs. For example, if you buy 3 Apple TVs, you will pay the price of 2 only
export class BuyNPayForMDealRule extends Rule {
  sku: SKU;
  buyQuantity: number;
  payQuantity: number;
  constructor({ sku, buyQuantity, payQuantity }: BuyNPayForMDealRuleProp) {
    super();
    this.sku = sku;
    this.buyQuantity = buyQuantity;
    this.payQuantity = payQuantity;
  }

  updateItemsPrice(items: Item[]): Item[] {
    const ruleNonAApplicableItems = items.filter(v => v.sku !== this.sku);
    const ruleApplicableItems = items.filter(v => v.sku === this.sku);

    // marking price to zero in case of remainderIndex greater than payQuantity(2) and 'less than or equal' to buyQuantity (3)
    const modifiesItems = ruleApplicableItems.map((value, index) => {
      let remainderIndex = (index % this.buyQuantity) + 1;

      if (
        remainderIndex > this.payQuantity &&
        remainderIndex <= this.buyQuantity
      ) {
        value.priceCents = 0;
      }

      return value;
    });

    const resultItems: Item[] = [...ruleNonAApplicableItems, ...modifiesItems];

    return resultItems;
  }
}

interface BulkBuyFlatDiscountRuleProp {
  sku: SKU;
  numberOfUnits: number;
  discountedPriceCents: number;
}

// the brand new Super iPad will have a bulk discounted applied, where the price will drop to $499.99 each, if someone buys more than 4
export class BulkBuyFlatDiscountRule extends Rule {
  sku: SKU;
  numberOfUnits: number;
  discountedPriceCents: number;
  constructor({
    sku,
    numberOfUnits,
    discountedPriceCents,
  }: BulkBuyFlatDiscountRuleProp) {
    super();
    this.sku = sku;
    this.numberOfUnits = numberOfUnits;
    this.discountedPriceCents = discountedPriceCents;
  }

  updateItemsPrice(items: Item[]): Item[] {
    const ruleNonAApplicableItems = items.filter(v => v.sku !== this.sku);
    const ruleApplicableItems = items.filter(v => v.sku === this.sku);

    // marking price to discounted price in case of remainderIndex greater than numberOfUnits(4).
    const countOfItems = ruleApplicableItems.length;
    let modifiedItems: Item[] = [];
    if (countOfItems > this.numberOfUnits) {
      modifiedItems = ruleApplicableItems.map(value => {
        value.priceCents = this.discountedPriceCents;

        return value;
      });
    }
    // HighlightNote: avoiding use of else , as its good practice
    if (countOfItems <= this.numberOfUnits) {
      modifiedItems = ruleApplicableItems;
    }

    const resultItems: Item[] = [...ruleNonAApplicableItems, ...modifiedItems];

    return resultItems;
  }
}

interface BundleDiscountRuleProp {
  buySku: SKU;
  buyQuantity: number;
  freeSku: SKU;
  freeQuantity: number;
}

// We will bundle in a free VGA adapter free of charge with every MacBook Pro sold
export class BundleDiscountRule extends Rule {
  buySku: SKU;
  buyQuantity: number;
  freeSku: SKU;
  freeQuantity: number;

  constructor({
    buySku,
    buyQuantity,
    freeSku,
    freeQuantity,
  }: BundleDiscountRuleProp) {
    super();
    this.buySku = buySku;
    this.buyQuantity = buyQuantity;
    this.freeSku = freeSku;
    this.freeQuantity = freeQuantity;
  }

  updateItemsPrice(items: Item[]): Item[] {
    // filter free items in
    const ruleApplicableBuyItems = items.filter(v => v.sku === this.buySku);

    const ruleApplicableFreeItems = items.filter(v => v.sku === this.freeSku);
    const ruleNotApplicableFreeItems = items.filter(
      v => v.sku !== this.freeSku
    );

    // checking number of bundles
    let numberOfFreeBundlesToAdd = 0;
    ruleApplicableBuyItems.forEach((_value, index) => {
      let remainderIndex = (index + 1) % this.buyQuantity;

      if (remainderIndex === 0) {
        numberOfFreeBundlesToAdd++;
      }
    });

    let numberOfFreeItemsOffered = numberOfFreeBundlesToAdd * this.freeQuantity;

    // set price zero for freely offered bundled items
    const freeLimitNumber = numberOfFreeItemsOffered;
    const modifiedItems = ruleApplicableFreeItems.map((value, index) => {
      if (index + 1 <= freeLimitNumber) {
        value.priceCents = 0;
        numberOfFreeItemsOffered--;
      }
      return value;
    });

    // if free item is not present adding to cart
    const freeItem = ItemCatalog.getItem(this.freeSku);
    freeItem.priceCents = 0;
    while (numberOfFreeItemsOffered > 0) {
      numberOfFreeItemsOffered--;
      modifiedItems.push(freeItem);
    }

    const resultItems: Item[] = [
      ...ruleNotApplicableFreeItems,
      ...modifiedItems,
    ];

    return resultItems;
  }
}
