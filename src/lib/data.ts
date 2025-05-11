const data = {
    headerMenus: [
        {
            name: 'Sản phẩm mới',
            href: '/search?tag=new-arrival',
        },
        {
            name: 'Sản phẩm bán chạy',
            href: '/search?tag=best-seller',
        },
        {
            name: 'Dịch vụ khách hàng',
            href: '/page/customer-service',
        },
        {
            name: 'Về chúng tôi',
            href: '/page/about-us',
        },
        {
            name: 'Hỗ trợ',
            href: '/page/help',
        },
    ],
    carousels: [
        {
            title: 'Build Your Dream PC',
            buttonCaption: 'Start Building',
            image: '/images/banner1.jpg',
            url: '/custom-pc-builder',
            isPublished: true,
        },
        {
            title: 'Top Graphics Cards',
            buttonCaption: 'View Deals',
            image: '/images/banner2.jpg',
            url: '/search?category=gpu&sort=hot',
            isPublished: true,
        },
        {
            title: 'Gaming Gear Sale',
            buttonCaption: 'Shop Accessories',
            image: '/images/banner3.png',
            url: '/search?tag=gaming-accessories',
            isPublished: true,
        },
    ],
}

export default data
