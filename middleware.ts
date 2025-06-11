import {NextRequest, NextResponse} from 'next/server'
import {jwtVerify} from 'jose'

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

const protectedAdminRoutes = ['/admin']

export async function middleware(req: NextRequest) {
    const {pathname} = req.nextUrl

    if (protectedAdminRoutes.some((path) => pathname.startsWith(path))) {
        const token = req.cookies.get('accessToken')?.value

        if (!token) {
            return NextResponse.redirect(new URL('/admin', req.url))
        }

        try {
            const {payload} = await jwtVerify(token, SECRET_KEY)

            const role = payload.role as string

            if (role !== 'Admin') {
                return NextResponse.redirect(new URL('/admin', req.url))
            }

            return NextResponse.next()
        } catch (err) {
            console.error('❌ Token verification failed:', err)
            return NextResponse.redirect(new URL('/admin', req.url))
        }
    }

    return NextResponse.next()
}
