// utils/errorHandler.ts
import {AxiosError} from 'axios';
import {ErrorResponse} from '@/types/errorResponse';

export const isErrorResponse = (error: unknown): error is ErrorResponse => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'type' in error &&
        'title' in error &&
        'status' in error &&
        'detail' in error
    );
};

export const handleErrorResponse = (error: unknown): string => {
    if (error instanceof AxiosError) {
        const errData = error.response?.data;

        if (isErrorResponse(errData)) {
            switch (errData.title) {
                case 'Customer.EmailInvalidFormat':
                    return 'Email không hợp lệ. Vui lòng kiểm tra lại.';
                case 'Customer.CustomerAlreadyExists':
                    return 'Email đã được sử dụng. Vui lòng chọn email khác.';
                case 'Customer.NotFound':
                    return 'Tài khoản không tồn tại.';
                case 'Customer.WrongPassword':
                    return 'Mật khẩu không chính xác.';
                case 'Customer.NotPaid':
                    return 'Bạn chưa mua sản phẩm'
                case 'Customer.AllReadyReview' :
                    return 'Bạn đã review sản phẩm'
                case 'Order.Status' :
                    return 'Không thể thay đổi trạng thái đơn hàng'
                default:
                    return errData.detail || 'Đã xảy ra lỗi. Vui lòng thử lại.';
            }
        }

        switch (error.response?.status) {
            case 400:
                return 'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại dữ liệu.';
            case 401:
                return 'Bạn chưa đăng nhập hoặc phiên đã hết hạn.';
            case 403:
                return 'Bạn không có quyền thực hiện hành động này.';
            case 404:
                return 'Không tìm thấy dữ liệu.';
            case 500:
                return 'Lỗi hệ thống. Vui lòng thử lại sau.';
            default:
                return 'Lỗi không xác định. Vui lòng thử lại.';
        }
    }

    return 'Đã xảy ra lỗi không xác định.';
};
