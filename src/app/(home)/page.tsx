import {HomeCarousel} from '@/components/shared/home/HomeCarousel';
import data from '@/lib/data';
import {HomeCard} from '@/components/shared/home/HomeCard';
import {Card, CardContent} from '@/components/ui/Card';
import {homeCards} from '@/lib/homeCards';
import {ProductCarousel} from "@/components/shared/home/ProductCarousel";
import axiosClient from "@/lib/axiosClient";
import {Product} from "@/types/product";
import {Category} from "@/types/category";
import SidebarMenu from "@/components/shared/home/SidebarMenu";
import ProductCategoryGrid from "@/components/shared/home/ProductCategoryGrid";

async function fetchProducts(keyword: string): Promise<Product[]> {
    const res = await axiosClient.get(`/api/v1/products/filter?keyword=${keyword}&sortBy=sold_quantity&isDescending=true`);
    return res.data.data;
}

async function fetchCategories(): Promise<Category[]> {
    const res = await axiosClient.get(`/api/v1/categories`);
    return res.data;
}

export default async function Page() {
    const [laptops, vgas, categories] = await Promise.all([
        fetchProducts('Laptop'),
        fetchProducts('VGA'),
        fetchCategories()
    ]);

    return (
        <div className="container mx-auto p-3">
            <div className="flex flex-col lg:flex-row min-h-[320px] gap-4">
                <div className="w-full lg:w-[240px] hidden lg:block">
                    <SidebarMenu categories={categories}/>
                </div>

                <div className="w-full lg:flex-1">
                    <HomeCarousel items={data.carousels}/>
                </div>
            </div>

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
                    <CardContent className="p-4 gap-3">
                        <h2 className="text-xl font-semibold mb-4">PC Bán Chạy</h2>
                        <ProductCarousel products={vgas}/>
                    </CardContent>
                </Card>
                <Card className="w-full rounded-none">
                    <CardContent className="p-4 gap-3">
                        <h2 className="text-xl font-semibold mb-4">Chuột</h2>
                        <ProductCarousel products={vgas}/>
                    </CardContent>
                </Card>
                <Card className="w-full rounded-none">
                    <CardContent className="p-4 gap-3">
                        <h2 className="text-xl font-semibold mb-4">Bàn Phím</h2>
                        <ProductCarousel products={vgas}/>
                    </CardContent>
                </Card>
                <Card className="w-full rounded-none">
                    <CardContent className="p-4 gap-3">
                        <h2 className="text-xl font-semibold mb-4">Màng Hình</h2>
                        <ProductCarousel products={vgas}/>
                    </CardContent>
                </Card>
                <ProductCategoryGrid categories={categories}/>
            </div>
        </div>
    );
}
