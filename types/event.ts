import { ITicket } from './ticket';

export enum EventStatus {
    SOLD_OUT = 'sold out',
    ON_SALE = 'on sale',
    UPCOMING = 'upcoming',
    CANCELLED = 'cancelled',
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
    createdAt: string;
    updatedAt: string;
    availableTicket: ITicket[];
}