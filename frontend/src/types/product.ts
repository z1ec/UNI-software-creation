export type ProductListItem = {
  id: number;
  title: string;
  image: string | null;
  price: number;
  discount: number | null;
  stock: number;
  new: boolean;
  brand: string;
  type: string;
};
