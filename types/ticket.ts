// types/ticket.ts
export interface ITicket {
  _id: string;
  barcode: string;
  eventId: string;
  position: string;
  originalPrice: number;
  resalePrice?: number;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  onSale: boolean;
}
