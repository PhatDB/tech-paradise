import {HomeCarousel} from '@/components/shared/home/home-carousel';
import data from '@/lib/data';
import {HomeCard} from '@/components/shared/home/home-card';
import {Card, CardContent} from '@/components/ui/card';
import {homeCards} from '@/lib/homeCards';
import {bestSellerPCs} from '@/lib/bestSellerPCs';
import {BestSellerPcList} from "@/components/shared/home/best-seller";

export default async function Page() {
    return (
        <div className="container mx-auto overflow-hidden">
            <HomeCarousel items={data.carousels}/>
            <div className="md:space-y-4 rounded-lg my-3">
                <HomeCard cards={homeCards}/>

                <Card className="w-full rounded-none">
                    <CardContent className="p-4 gap-3">
                        <h2 className="text-xl font-semibold mb-4">PC Bán Chạy</h2>
                        <BestSellerPcList products={bestSellerPCs}/>
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
