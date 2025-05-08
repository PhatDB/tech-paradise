import {withApiHandler} from '@/lib/with-api-handler';
import {apiPut, apiDelete} from '@/lib/api-helper';

export const PUT = withApiHandler(async (req, {params}) => {
    const body = await req.json();
    return await apiPut(`/api/v1/brands/${params.id}`, body);
});

export const DELETE = withApiHandler(async (req, {params}) => {
    return await apiDelete(`/api/v1/brands/${params.id}`);
});
