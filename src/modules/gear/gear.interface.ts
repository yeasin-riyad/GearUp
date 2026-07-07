export interface ICreateGear {
  name: string;
  description: string;

  brand?: string;
  image?: string;

  pricePerDay: number;
  stock: number;

  categoryId: string;
}

export interface IUpdateGear {
  name?: string;
  description?: string;

  brand?: string;
  image?: string;

  pricePerDay?: number;
  stock?: number;

  categoryId?: string;
}

export interface IUpdateGear {
  name?: string;
  description?: string;

  brand?: string;
  image?: string;

  pricePerDay?: number;
  stock?: number;

  categoryId?: string;
}