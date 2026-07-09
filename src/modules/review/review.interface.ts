export interface ICreateReview {
  rentalOrderId: string;
  gearItemId: string;
  rating: number;
  comment?: string;
}

export interface IUpdateReview {
  rating?: number;
  comment?: string;
}