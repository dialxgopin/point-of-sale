import { Payment } from "./payment";

export interface Sale {
    id: string;
    saleNumber: number;
    identifier: string;
    name: string;
    item: string;
    price: number;
    card: number;
    cash: number;
    transfer: Payment[];
    installments: Payment[];
    date: Date;
}