export interface IProducts {
  id: number,
  title: string,
  price: number,
  year: string,
  image?: string,
  configure: IProductsConfig;
  quantity: number;
}

export interface IProductsConfig {
  chip: string,
  SSD: string,
  memory: string,
  display: string,
}
