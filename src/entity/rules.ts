import Item from '../entity/item';

export abstract class Rule {
  abstract updateItemsPrice(items: Item[]): Item[];
}

interface BuyNPayForMDealRuleProp {
  sku: string;
  buyQuantity: number;
  payQuantity: number;
}

// We're going to have a 3 for 2 deal on Apple TVs. For example, if you buy 3 Apple TVs, you will pay the price of 2 only
export class BuyNPayForMDealRule extends Rule {
  sku: string;
  buyQuantity: number;
  payQuantity: number;
  // to change
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
