export interface MenuItem {
    label: string;
    href: string;
}

export interface SubCategory {
    title: string;
    items: MenuItem[];
}

export interface MenuCategory {
    label: string;
    href: string;
    subcategories: SubCategory[];
    featuredImage?: string; // Gələcəkdə şəkil URL-i olacaq
}

export const MENU_DATA: MenuCategory[] = [
    {
        label: 'Kişi',
        href: '/shop?category=men',
        featuredImage: '/images/menu/men.png', // Generasiya edilmiş Şəkil
        subcategories: [
            {
                title: '', // Başlıq yoxdur
                items: [
                    { label: 'Yeni Gələnlər', href: '/shop?category=men&sort=new' },
                    { label: 'Hamısına bax', href: '/shop?category=men' },
                ],
            },
            {
                title: 'Geyim',
                items: [
                    { label: 'Kofta və T-shirt', href: '/shop?category=men&type=t-shirts' },
                    { label: 'Şalvarlar', href: '/shop?category=men&type=pants' },
                    { label: 'Cinslər', href: '/shop?category=men&type=jeans' },
                    { label: 'Pencək və Kostyum', href: '/shop?category=men&type=suits' },
                    { label: 'Mont və Gödəkcə', href: '/shop?category=men&type=jackets' },
                    { label: 'Şortlar', href: '/shop?category=men&type=shorts' },
                ],
            },
            {
                title: 'Ayaqqabı',
                items: [
                    { label: 'Krasovkalar', href: '/shop?category=men&type=sneakers' },
                    { label: 'Klassik Ayaqqabılar', href: '/shop?category=men&type=classic-shoes' },
                    { label: 'Botlar', href: '/shop?category=men&type=boots' },
                    { label: 'Loaferlər', href: '/shop?category=men&type=loafers' },
                ],
            },
        ],
    },
    {
        label: 'Qadın',
        href: '/shop?category=women',
        featuredImage: '/images/menu/women.png',
        subcategories: [
            {
                title: '', // Başlıq yoxdur
                items: [
                    { label: 'Yeni Gələnlər', href: '/shop?category=women&sort=new' },
                    { label: 'Hamısına bax', href: '/shop?category=women' },
                ],
            },
            {
                title: 'Geyim',
                items: [
                    { label: 'Donlar', href: '/shop?category=women&type=dresses' },
                    { label: 'Bluz və Köynək', href: '/shop?category=women&type=blouses' },
                    { label: 'Şalvarlar', href: '/shop?category=women&type=pants' },
                    { label: 'Ətəklər', href: '/shop?category=women&type=skirts' },
                    { label: 'Pencəklər', href: '/shop?category=women&type=blazers' },
                    { label: 'Palto və Gödəkcə', href: '/shop?category=women&type=coats' },
                ],
            },
            {
                title: 'Ayaqqabı',
                items: [
                    { label: 'Dabanlı Ayaqqabılar', href: '/shop?category=women&type=heels' },
                    { label: 'Krasovkalar', href: '/shop?category=women&type=sneakers' },
                    { label: 'Sandallar', href: '/shop?category=women&type=sandals' },
                    { label: 'Botlar', href: '/shop?category=women&type=boots' },
                ],
            },
        ],
    },
    {
        label: 'Uşaq',
        href: '/shop?category=kids',
        featuredImage: '/images/menu/kids.png',
        subcategories: [
            {
                title: '', // Başlıq yoxdur
                items: [
                    { label: 'Yeni Gələnlər', href: '/shop?category=kids&sort=new' },
                    { label: 'Hamısına bax', href: '/shop?category=kids' },
                ],
            },
            {
                title: 'Oğlan Uşağı',
                items: [
                    { label: 'T-shirtlər', href: '/shop?category=kids&gender=boy&type=t-shirts' },
                    { label: 'Şalvarlar', href: '/shop?category=kids&gender=boy&type=pants' },
                    { label: 'Dəstlər', href: '/shop?category=kids&gender=boy&type=sets' },
                ],
            },
            {
                title: 'Qız Uşağı',
                items: [
                    { label: 'Donlar', href: '/shop?category=kids&gender=girl&type=dresses' },
                    { label: 'Ətəklər', href: '/shop?category=kids&gender=girl&type=skirts' },
                    { label: 'Dəstlər', href: '/shop?category=kids&gender=girl&type=sets' },
                ],
            },
        ],
    },
    {
        label: 'Aksesuar',
        href: '/shop?category=accessories',
        featuredImage: '/images/menu/accessories.png',
        subcategories: [
            {
                title: '', // Başlıq yoxdur
                items: [
                    { label: 'Yeni Gələnlər', href: '/shop?category=accessories&sort=new' },
                    { label: 'Hamısına bax', href: '/shop?category=accessories' },
                ],
            },
            {
                title: 'Çantalar',
                items: [
                    { label: 'Qadın Çantaları', href: '/shop?category=accessories&type=women-bags' },
                    { label: 'Kişi Çantaları', href: '/shop?category=accessories&type=men-bags' },
                    { label: 'Bel Çantaları', href: '/shop?category=accessories&type=backpacks' },
                ],
            },
            {
                title: 'Aksesuarlar',
                items: [
                    { label: 'Kəmərlər', href: '/shop?category=accessories&type=belts' },
                    { label: 'Şərflər', href: '/shop?category=accessories&type=scarves' },
                    { label: 'Eynəklər', href: '/shop?category=accessories&type=sunglasses' },
                    { label: 'Saatlar', href: '/shop?category=accessories&type=watches' },
                    { label: 'Papaqlar', href: '/shop?category=accessories&type=hats' },
                ],
            },
        ],
    },
];
