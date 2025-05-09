import {HomeCarousel} from '@/components/shared/home/home-carousel'
import data from '@/lib/data'
import {HomeCard} from "@/components/shared/home/home-card";
import {Card, CardContent} from '@/components/ui/card'
import {homeCards} from "@/lib/homeCards";

export default async function Page() {
    return (
        <>
            <HomeCarousel items={data.carousels}/>
            <div className='md:p-4 md:space-y-4 bg-border'>
                <HomeCard cards={homeCards}/>
                <Card className='w-full rounded-none'>
                    <CardContent className='p-4 items-center gap-3'>
                    </CardContent>
                </Card>
                <Card className='w-full rounded-none'>
                    <CardContent className='p-4 items-center gap-3'>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}