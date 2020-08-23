import { SKU } from '../lib/enums';
interface ItemProp {
  sku: SKU;
  name: string;
  priceCents: number;
}

export default class Item {
  private _sku: SKU;
  public get sku(): SKU {
    return this._sku;
  }
  public set sku(v: SKU) {
    this._sku = v;
  }

  private _name: string;
  public get name(): string {
    return this._name;
  }
  public set name(v: string) {
    this._name = v;
  }

  private _priceCents: number;
  public get priceCents(): number {
    return this._priceCents;
  }
  public set priceCents(v: number) {
    this._priceCents = v;
  }

  constructor({ sku, name, priceCents }: ItemProp) {
    this._sku = sku;
    this._name = name;
    this._priceCents = priceCents;
  }
}
