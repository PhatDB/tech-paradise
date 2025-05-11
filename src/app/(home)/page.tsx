import {HomeCarousel} from '@/components/shared/home/HomeCarousel';
import data from '@/lib/data';
import {HomeCard} from '@/components/shared/home/HomeCard';
import {Card, CardContent} from '@/components/ui/Card';
import {homeCards} from '@/lib/homeCards';
import {ProductCarousel} from "@/components/shared/home/ProductCarousel";
import axiosClient from "@/lib/axiosClient";
import {Product} from "@/types/product";

async function fetchProducts(keyword: string): Promise<Product[]> {
    const res = await axiosClient.get(`/api/v1/products/filter?keyword=${keyword}`);
    return res.data.data;
}

export default async function Page() {
    const [laptops, vgas] = await Promise.all([
        fetchProducts('Laptop'),
        fetchProducts('VGA')
    ]);

    return (
        <div className="container mx-auto overflow-hidden p-3">
            <HomeCarousel items={data.carousels}/>
            <div className="md:space-y-4 rounded-lg my-3">
                <HomeCard cards={homeCards}/>

                <Card className="w-full rounded-none">
                    <CardContent className="p-4 gap-3">
                        <h2 className="text-xl font-semibold mb-4">Laptop Bán Chạy</h2>
                        <ProductCarousel products={laptops}/>
                    </CardContent>
                </Card>

                <Card className="w-full rounded-none">
                    <CardContent className="p-4 gap-3">
                        <h2 className="text-xl font-semibold mb-4">VGA Bán Chạy</h2>
                        <ProductCarousel products={vgas}/>
                    </CardContent>
                </Card>

                <Card className="w-full rounded-none">
                    <CardContent className="p-4 items-center gap-3">
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
