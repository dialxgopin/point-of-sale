export interface Sale {
    id: string;
    identifier: string;
    name: string;
    item: string;
    price: number;
    card: number;
    cash: number;
    installments: number;
    date: Date;
}
