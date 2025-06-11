export function getOrderStatusText(status: number): string {
    switch (status) {
        case 0:
            return 'Đã tạo đơn';
        case 1:
            return 'Đã thanh toán';
        case 2:
            return 'Đã giao hàng';
        case 3:
            return 'Đã hủy';
        default:
            return 'Không xác định';
    }
}
