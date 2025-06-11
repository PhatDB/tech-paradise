export interface Address {
    addressId: number;
    street: string;
    hamlet: string;
    ward: string;
    district: string;
    city: string;
}

export interface CustomerInfo {
    customerId: number;
    customerName: string;
    email: string;
    phone: string | null;
    address: Address[];
}
