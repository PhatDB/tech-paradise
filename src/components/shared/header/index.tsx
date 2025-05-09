import {APP_NAME} from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import Menu from './menu';
import {Button} from '@/components/ui/button';
import {MenuIcon} from 'lucide-react';
import data from '@/lib/data';
import Search from './search';

export default function Header() {
    return (
        <header className="bg-white text-black border-b">
            <div className="container mx-auto">
                <div className="flex items-center justify-between py-2">
                    <Link href="/" className="flex items-center gap-2 header-button text-2xl font-extrabold">
                        <Image src="/icons/logo.svg" width={40} height={40} alt={`${APP_NAME} logo`}/>
                        <span className="hidden sm:inline">{APP_NAME}</span>
                    </Link>

                    <div className="hidden md:block flex-1 max-w-xl mx-4">
                        <Search/>
                    </div>

                    <Menu/>
                </div>

                <div className="block md:hidden py-2">
                    <Search/>
                </div>
            </div>

            <div className="container mx-auto flex items-center px-3 gap-3 overflow-x-auto scrollbar-hide">
                <Button
                    variant="ghost"
                    className="header-button flex items-center gap-1 text-base [&_svg]:size-5 min-w-fit"
                >
                    <MenuIcon/>
                    All
                </Button>
                {data.headerMenus.map((menu) => (
                    <Link
                        href={menu.href}
                        key={menu.href}
                        className="header-button text-sm py-1.5 px-3 whitespace-nowrap"
                    >
                        {menu.name}
                    </Link>
                ))}
            </div>
        </header>
    );
}
