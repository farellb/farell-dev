export interface Product {
    id: string | number;
    name: string;
    price: string; // e.g. "120 AZN"
    numericPrice: number;
    category: string;
    images: string[];
    description?: string;
    sizes: string[];
}

export const PRODUCTS: Product[] = [
    {
        id: 1,
        name: "Oversized Blazer",
        price: "120 AZN",
        numericPrice: 120,
        category: "women",
        images: [
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
            "https://images.unsplash.com/photo-1548624149-f32d88e89cd8?w=800&q=80"
        ],
        description: "Minimalist oversized blazer perfect for layering. Made from premium wool blend.",
        sizes: ["XS", "S", "M", "L"]
    },
    {
        id: 2,
        name: "Linen Trousers",
        price: "85 AZN",
        numericPrice: 85,
        category: "men",
        images: [
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
            "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&q=80"
        ],
        description: "Breathable linen trousers for a relaxed summer look.",
        sizes: ["30", "32", "34", "36"]
    },
    {
        id: 3,
        name: "Silk Blouse",
        price: "95 AZN",
        numericPrice: 95,
        category: "women",
        images: [
            "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&q=80",
            "https://images.unsplash.com/photo-1563178406-4fb4697980ff?w=800&q=80"
        ],
        description: "Elegant silk blouse with a soft sheen.",
        sizes: ["S", "M", "L"]
    },
    {
        id: 4,
        name: "Classic Coat",
        price: "250 AZN",
        numericPrice: 250,
        category: "women",
        images: [
            "https://images.unsplash.com/photo-1539533018447-63fcce667c1f?w=800&q=80",
            "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&q=80"
        ],
        description: "Timeless coat structure with a modern cut.",
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: 5,
        name: "Regular Fit Shirt",
        price: "65 AZN",
        numericPrice: 65,
        category: "men",
        images: [
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80"
        ],
        description: "Crisp white shirt for formal and casual occasions.",
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: 6,
        name: "Leather Bag",
        price: "150 AZN",
        numericPrice: 150,
        category: "accessories",
        images: [
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80"
        ],
        description: "Genuine leather bag with minimalist hardware.",
        sizes: ["One Size"]
    },
];
