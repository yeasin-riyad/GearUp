export interface IRentalItem {
  gearItemId: string;
  quantity: number;
}

export interface ICreateRentalOrder {
  startDate: string;
  endDate: string;
  items: IRentalItem[];
}