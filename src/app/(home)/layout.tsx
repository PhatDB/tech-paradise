// src/app/(home)/page.tsx
import {HomeCarousel} from '@/components/shared/home/home-carousel';
import axiosClient from '@/lib/axios';

export default async function Page() {
    const res = await axiosClient.get('/api/v1/brands');
    const brands = res.data;

    console.log('Brands data:', brands);

    return <HomeCarousel items={brands}/>;
}
