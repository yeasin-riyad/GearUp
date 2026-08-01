export interface ICreateGear {
  name: string;
  description: string;
  location: string;

  brand?: string;
  images?: string[];
  features: string[];

  pricePerDay: number;
  deposit: number;
  stock: number;

  categoryId: string;
}

export interface IUpdateGear {
  name?: string;
  description?: string;
  location?: string;

  brand?: string;
  images?: string[];
  features?: string[];

  pricePerDay?: number;
  deposit?: number;
  stock?: number;

  categoryId?: string;
}
