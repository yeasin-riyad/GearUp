export interface ICreateCategory {
  name: string;
  description?: string;
  image?: string;
}

export interface IUpdateCategory {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
}