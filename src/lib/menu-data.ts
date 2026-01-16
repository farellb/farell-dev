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
        href: '/category/men',
        featuredImage: '/images/menu/men.png', // Generasiya edilmiş Şəkil
        subcategories: [
            {
                title: '', // Başlıq yoxdur
                items: [
                    { label: 'Yeni Gələnlər', href: '/category/men/new' },
                    { label: 'Hamısına bax', href: '/category/men/all' },
                ],
            },
            {
                title: 'Geyim',
                items: [
                    { label: 'Kofta və T-shirt', href: '/category/men/t-shirts' },
                    { label: 'Şalvarlar', href: '/category/men/pants' },
                    { label: 'Cinslər', href: '/category/men/jeans' },
                    { label: 'Pencək və Kostyum', href: '/category/men/suits' },
                    { label: 'Mont və Gödəkcə', href: '/category/men/jackets' },
                    { label: 'Şortlar', href: '/category/men/shorts' },
                ],
            },
            {
                title: 'Ayaqqabı',
                items: [
                    { label: 'Krasovkalar', href: '/category/men/sneakers' },
                    { label: 'Klassik Ayaqqabılar', href: '/category/men/classic-shoes' },
                    { label: 'Botlar', href: '/category/men/boots' },
                    { label: 'Loaferlər', href: '/category/men/loafers' },
                ],
            },
        ],
    },
    {
        label: 'Qadın',
        href: '/category/women',
        featuredImage: '/images/menu/women.png',
        subcategories: [
            {
                title: '', // Başlıq yoxdur
                items: [
                    { label: 'Yeni Gələnlər', href: '/category/women/new' },
                    { label: 'Hamısına bax', href: '/category/women/all' },
                ],
            },
            {
                title: 'Geyim',
                items: [
                    { label: 'Donlar', href: '/category/women/dresses' },
                    { label: 'Bluz və Köynək', href: '/category/women/blouses' },
                    { label: 'Şalvarlar', href: '/category/women/pants' },
                    { label: 'Ətəklər', href: '/category/women/skirts' },
                    { label: 'Pencəklər', href: '/category/women/blazers' },
                    { label: 'Palto və Gödəkcə', href: '/category/women/coats' },
                ],
            },
            {
                title: 'Ayaqqabı',
                items: [
                    { label: 'Dabanlı Ayaqqabılar', href: '/category/women/heels' },
                    { label: 'Krasovkalar', href: '/category/women/sneakers' },
                    { label: 'Sandallar', href: '/category/women/sandals' },
                    { label: 'Botlar', href: '/category/women/boots' },
                ],
            },
        ],
    },
    {
        label: 'Uşaq',
        href: '/category/kids',
        featuredImage: '/images/menu/kids.png',
        subcategories: [
            {
                title: '', // Başlıq yoxdur
                items: [
                    { label: 'Yeni Gələnlər', href: '/category/kids/new' },
                    { label: 'Hamısına bax', href: '/category/kids/all' },
                ],
            },
            {
                title: 'Oğlan Uşağı',
                items: [
                    { label: 'T-shirtlər', href: '/category/kids/boys-tshirts' },
                    { label: 'Şalvarlar', href: '/category/kids/boys-pants' },
                    { label: 'Dəstlər', href: '/category/kids/boys-sets' },
                ],
            },
            {
                title: 'Qız Uşağı',
                items: [
                    { label: 'Donlar', href: '/category/kids/girls-dresses' },
                    { label: 'Ətəklər', href: '/category/kids/girls-skirts' },
                    { label: 'Dəstlər', href: '/category/kids/girls-sets' },
                ],
            },
        ],
    },
    {
        label: 'Aksesuar',
        href: '/category/accessories',
        featuredImage: '/images/menu/accessories.png',
        subcategories: [
            {
                title: '', // Başlıq yoxdur
                items: [
                    { label: 'Yeni Gələnlər', href: '/category/accessories/new' },
                    { label: 'Hamısına bax', href: '/category/accessories/all' },
                ],
            },
            {
                title: 'Çantalar',
                items: [
                    { label: 'Qadın Çantaları', href: '/category/accessories/women-bags' },
                    { label: 'Kişi Çantaları', href: '/category/accessories/men-bags' },
                    { label: 'Bel Çantaları', href: '/category/accessories/backpacks' },
                ],
            },
            {
                title: 'Aksesuarlar',
                items: [
                    { label: 'Kəmərlər', href: '/category/accessories/belts' },
                    { label: 'Şərflər', href: '/category/accessories/scarves' },
                    { label: 'Eynəklər', href: '/category/accessories/sunglasses' },
                    { label: 'Saatlar', href: '/category/accessories/watches' },
                    { label: 'Papaqlar', href: '/category/accessories/hats' },
                ],
            },
        ],
    },
];
