import {NextRequest} from 'next/server';

type Handler = (req: NextRequest, ctx?: any) => Promise<any>;

export function withApiHandler(handler: Handler) {
    return async (req: NextRequest, ctx?: any): Promise<Response> => {
        try {
            const result = await handler(req, ctx);
            return Response.json(result);
        } catch (error: any) {
            console.error('❌ API Handler Error:', error);

            const status = error?.status || 500;
            const message = error?.message || 'Internal server error';

            return Response.json({success: false, message}, {status});
        }
    };
}
