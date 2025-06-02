export interface Customer {
    customerId: number;
    email: string;
    customerName: string;
    accessToken: string;
    accessTokenExpires: number;
    refreshToken: string;
}
