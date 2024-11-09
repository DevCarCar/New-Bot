interface Item {
  id: string;
  name: string;
  description: string;
  rarity: number;
  type: number;
  contents?: Array<object>;
  atk?: number;
  def?: number;
  use?: Function;
  sellprice?: number;
}
