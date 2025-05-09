import {AxiosError} from 'axios';
import type {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const handleApiError = (error: unknown, router?: AppRouterInstance): void => {
    if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || 'Có lỗi xảy ra.';

        switch (status) {
            case 400:
                alert(`Yêu cầu không hợp lệ: ${message}`);
                break;

            case 401:
                alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                router?.push('/login');
                break;

            case 403:
                alert('Bạn không có quyền truy cập chức năng này.');
                router?.push('/forbidden');
                break;

            case 404:
                alert('Không tìm thấy dữ liệu.');
                router?.push('/not-found');
                break;

            case 500:
                alert('Lỗi hệ thống. Vui lòng thử lại sau.');
                break;

            default:
                alert(message);
        }
    } else {
        alert('Lỗi không xác định. Vui lòng thử lại.');
    }
};
