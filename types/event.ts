import { ITicket } from "./ticket";

export enum EventStatus {
  SOLD_OUT = "sold out",
  ON_SALE = "on sale",
  UPCOMING = "upcoming",
  CANCELLED = "cancelled",
  ENDED = "ended",
  ABOUT_TO_START = "about to start"
}

export interface IEvent {
  _id: string;
  name: string;
  description: string;
  status: EventStatus;
  type: string;
  images: { url: string }[];
  seatmap: string;
  startDate: string;
  endDate: string;
  performanceTime: string;  // Add this line
  createdAt: string;
  updatedAt: string;
  location: string;
  availableTicket: ITicket[];
}

