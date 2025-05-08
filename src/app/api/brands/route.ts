import {withApiHandler} from '@/lib/with-api-handler';
import {apiGet, apiPost} from '@/lib/api-helper';
import {NextRequest} from 'next/server';

export const GET = withApiHandler(async () => {
    const data = await apiGet('/api/v1/brands');
    return data;
});

export const POST = withApiHandler(async (req: NextRequest) => {
    const body = await req.json();
    const data = await apiPost('/api/v1/brands', body);
    return data;
});
