# Farell Brooklyn – Internal PRD (Developer Version)

> **Qeyd:** Bu sənəd müştəri üçün deyil. Layihənin texniki planlaması və development zamanı referans kimi istifadə olunacaq.

---

## 1. Layihənin Məntiqi (Core Idea)

Farell Brooklyn üçün **Instagram mərkəzli katalog vebsaytı** hazırlanır.

- Satış vebsayt üzərindən aparılmır
- Payment, checkout, user account YOXDUR
- Vebsaytın əsas rolu: **məhsulları göstərmək və WhatsApp üzərindən satışa yönləndirmək**

Bu model: *"Catalog → Inquiry → WhatsApp"*

---

## 2. Əsas User Flow

1. User vebsayta daxil olur
2. Kateqoriya və filterlər ilə məhsullara baxır
3. Məhsul seçir, variantlarını (ölçü, rəng) təyin edir
4. Məhsulu **Sorğu siyahısı**na əlavə edir
5. 1 və ya bir neçə məhsul seçdikdən sonra
6. "WhatsApp-a göndər" düyməsinə klik edir
7. Avtomatik yaradılmış mesaj ilə WhatsApp açılır

---

## 3. Page Structure

### Public Pages
- `/` – Landing
- `/category/[slug]` – Kateqoriya + filterlər
- `/product/[slug]` – Məhsul detal
- `/inquiry` – Sorğu siyahısı

### Admin Pages
- `/admin/login`
- `/admin`
- `/admin/products`
- `/admin/categories`

---

## 4. UI / Design Qaydaları

- Minimalist dizayn
- Ağ background
- Qara şriftlər
- Fokus məhsul şəkillərində
- Mobil-first

UI prinsipi: **Instagram estetikası + sadə kataloq**

---

## 5. Tech Stack (Final)

### Frontend
- React
- Next.js (App Router)
- Tailwind CSS
- shadcn/ui
- @phosphor-icons/react
- Zustand (Sorğu siyahısı state)

### Backend / Services
- Supabase
  - PostgreSQL
  - Auth (yalnız admin)
- Cloudinary (məhsul şəkilləri)

### Form & Utils
- react-hook-form
- zod
- slugify

### Deployment
- Vercel

---

## 6. State Management (Zustand)

**Inquiry Store saxlayacaq:**
- selectedProducts[]
- productId
- size
- color
- quantity

Funksiyalar:
- addProduct
- removeProduct
- updateVariant
- clearAll

---

## 7. WhatsApp İnteqrasiyası

- `wa.me` deep link istifadə olunacaq
- Mesaj client-side generate olunacaq
- `encodeURIComponent`

Mesaj məntiqi:
- Bir neçə məhsul bir mesajda
- Hər məhsul üçün:
  - Ad
  - Variantlar
  - Məhsul linki

---

## 8. Kateqoriya Sistemi (Dəqiq Struktur)

Kateqoriya sistemi **2 səviyyəlidir** və sabit 4 ana kateqoriya üzərində qurulur.

### 8.1 Ana Kateqoriyalar (Fixed)
Bu kateqoriyalar sistemdə **default və dəyişməz** olacaq:
- Kişi
- Qadın
- Uşaq
- Aksessuar

Bu kateqoriyalar hamburger menu-da əsas navigation kimi göstəriləcək.

### 8.2 Alt Kateqoriyalar (Dynamic)
Hər ana kateqoriyanın daxilində **özünə uyğun alt kateqoriyalar** olacaq.

Məsələn:
- Kişi
  - T-shirt
  - Hoodie
  - Şalvar
- Qadın
  - Don
  - Köynək
- Aksessuar
  - Papaq
  - Çanta

Alt kateqoriyalar:
- Admin paneldən əlavə olunur
- Filter və listing üçün istifadə olunur

---

## 9. Database (Sadə Struktur)

### categories
- id
- name
- slug
- parent_id (NULL = ana kateqoriya)

> Qeyd: Ana kateqoriyalar `parent_id = NULL`, alt kateqoriyalar isə uyğun ana kateqoriyanın `id`-sini saxlayır.

### products
- id
- name
- slug
- description
- category_id (alt kateqoriya)
- is_active

### product_variants
- id
- product_id
- size
- color

### product_images
- id
- product_id
- image_url

---

## 9. Admin Panel Məntiqi

- Sadə CRUD
- Texniki biliyi olmayan admin üçün
- Bulk əməliyyat YOX
- Fokus: sürətli məhsul əlavə etmə

---

## 10. Scope-dan Kənar (QƏTİ)

- Payment
- Checkout
- User registration
- Order history
- Stock management

---

## 11. Development Prioritetləri

1. Public katalog flow
2. Sorğu siyahısı + WhatsApp
3. Admin panel
4. SEO & performance

---

**Document type:** Internal PRD  
**Format:** Markdown

