import { Rule } from './rules';
import Item from './item';

interface CheckoutProp {
  rules: Rule[];
}

export default class Checkout {
  items: Item[] = [];
  rules: Rule[];
  constructor({ rules }: CheckoutProp) {
    this.rules = rules;
  }

  scan(item: Item) {
    this.items.push(item);
  }

  total() {
    let discountedItems: Item[] = this.items;

    this.rules.forEach(rule => {
      discountedItems = rule.updateItemsPrice(discountedItems);
    });

    const totalPriceCents = discountedItems
      .map(it => it.priceCents)
      .reduce((prev, next) => prev + next);

    return totalPriceCents;
  }
}
