import {CardItem} from '@/types';

export const homeCards: CardItem[] = [
    {
        title: 'Graphics Cards',
        link: {text: 'View All GPUs', href: '/search?category=gpu'},
        items: [
            {
                name: 'RTX 4090',
                image: '/images/products/rtx4090.jpg',
                href: '/product/rtx-4090',
            },
            {
                name: 'RX 7900 XT',
                image: '/images/products/rx7900xt.jpg',
                href: '/product/rx-7900-xt',
            },
        ],
    },
    {
        title: 'Processors',
        link: {text: 'Browse CPUs', href: '/search?category=cpu'},
        items: [
            {
                name: 'Intel Core i9',
                image: '/images/products/i9.jpg',
                href: '/product/intel-i9',
            },
            {
                name: 'Ryzen 9 7900X',
                image: '/images/products/ryzen9.jpg',
                href: '/product/ryzen-9',
            },
        ],
    },
    {
        title: 'Motherboards',
        link: {text: 'Explore Boards', href: '/search?category=motherboard'},
        items: [
            {
                name: 'ASUS ROG X670E',
                image: '/images/products/rog-x670e.jpg',
                href: '/product/rog-x670e',
            },
            {
                name: 'MSI B650 Tomahawk',
                image: '/images/products/b650.jpg',
                href: '/product/msi-b650',
            },
        ],
    },
    {
        title: 'Memory (RAM)',
        link: {text: 'View All RAM', href: '/search?category=ram'},
        items: [
            {
                name: 'Corsair 32GB DDR5',
                image: '/images/products/ram1.jpg',
                href: '/product/corsair-32gb',
            },
            {
                name: 'G.Skill Trident Z',
                image: '/images/products/ram2.jpg',
                href: '/product/gskill-trident',
            },
        ],
    },
    {
        title: 'Storage',
        link: {text: 'SSD & HDD', href: '/search?category=storage'},
        items: [
            {
                name: 'Samsung 980 PRO',
                image: '/images/products/980pro.jpg',
                href: '/product/980-pro',
            },
            {
                name: 'Seagate Barracuda',
                image: '/images/products/seagate.jpg',
                href: '/product/seagate-barracuda',
            },
        ],
    },
    {
        title: 'Power Supplies',
        link: {text: 'Shop PSUs', href: '/search?category=psu'},
        items: [
            {
                name: 'Corsair RM850x',
                image: '/images/products/rm850x.jpg',
                href: '/product/rm850x',
            },
            {
                name: 'Seasonic Prime TX',
                image: '/images/products/seasonic.jpg',
                href: '/product/seasonic-tx',
            },
        ],
    },
    {
        title: 'PC Cases',
        link: {text: 'View Cases', href: '/search?category=case'},
        items: [
            {
                name: 'NZXT H510',
                image: '/images/products/h510.jpg',
                href: '/product/nzxt-h510',
            },
            {
                name: 'Lian Li O11D',
                image: '/images/products/o11d.jpg',
                href: '/product/lian-li-o11d',
            },
        ],
    },
    {
        title: 'Coolers',
        link: {text: 'Shop Coolers', href: '/search?category=cooler'},
        items: [
            {
                name: 'Noctua NH-D15',
                image: '/images/products/nhd15.jpg',
                href: '/product/noctua-nhd15',
            },
            {
                name: 'NZXT Kraken Z73',
                image: '/images/products/kraken.jpg',
                href: '/product/kraken-z73',
            },
        ],
    },
];
