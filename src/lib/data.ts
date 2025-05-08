const data = {
  headerMenus: [
    {
      name: "Today's Deal",
      href: '/search?tag=todays-deal',
    },
    {
      name: 'New Arrivals',
      href: '/search?tag=new-arrival',
    },
    {
      name: 'Featured Products',
      href: '/search?tag=featured',
    },
    {
      name: 'Best Sellers',
      href: '/search?tag=best-seller',
    },
    {
      name: 'Browsing History',
      href: '/#browsing-history',
    },
    {
      name: 'Customer Service',
      href: '/page/customer-service',
    },
    {
      name: 'About Us',
      href: '/page/about-us',
    },
    {
      name: 'Help',
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
