export const projects = [
  {
    id: "pro-dashboard",
    title: { en: "Pro Dashboard", fa: "Pro Dashboard" },
    summary: {
      en: "A responsive project-management dashboard with a polished light and dark theme. Users sign in, manage their projects and follow live figures and analytics, all saved in the browser.",
      fa: "یک داشبورد ریسپانسیو برای مدیریت پروژه با تم روشن و تیره. کاربر وارد می‌شود، پروژه‌هایش را مدیریت می‌کند و آمار و تحلیل زنده را می‌بیند و همه‌چیز در مرورگر ذخیره می‌شود.",
    },
    highlights: {
      en: [
        "Sign-in with protected routes and return-to-page after login",
        "Create, edit, delete, search, filter and sort projects",
        "Analytics with a revenue chart and status breakdown",
        "Light and dark theme that remembers your choice",
        "Data saved in localStorage",
      ],
      fa: [
        "ورود با مسیرهای محافظت‌شده و بازگشت به صفحه‌ی قبلی بعد از ورود",
        "ساخت، ویرایش، حذف، جستجو، فیلتر و مرتب‌سازی پروژه‌ها",
        "تحلیل‌ها با نمودار درآمد و تفکیک وضعیت پروژه‌ها",
        "تم روشن و تیره که انتخاب کاربر را به یاد می‌ماند",
        "ذخیره‌ی داده‌ها در localStorage",
      ],
    },
    image: "/images/projects/pro-dashboard.webp",
    alt: {
      en: "Screenshot of the Pro Dashboard project-management app showing the dashboard page",
      fa: "تصویر صفحه‌ی داشبورد اپلیکیشن مدیریت پروژه‌ی Pro Dashboard",
    },
    tech: ["React", "Vite", "localStorage"],
    liveUrl: "https://pro-dashboard-eight.vercel.app/",
    repoUrl: "https://github.com/samanyarzada/Pro-Dashboard",
  },

  {
    id: "nova-store",
    title: { en: "Nova Store", fa: "Nova Store" },
    summary: {
      en: "A modern and responsive e-commerce storefront. Visitors can browse and search products, read product information and prices, and add items to the shopping cart.",
      fa: "یک فروشگاه اینترنتی مدرن و ریسپانسیو. بازدیدکننده می‌تواند محصول‌ها را ببیند و جستجو کند، اطلاعات و قیمت را بخواند و محصول را به سبد خرید اضافه کند.",
    },
    highlights: {
      en: [
        "Browse, search and explore products",
        "Product information and prices",
        "Add products to the shopping cart",
        "Responsive design for different screen sizes",
        "Fast development and performance with Vite",
      ],
      fa: [
        "دیدن، جستجو و بررسی محصول‌ها",
        "اطلاعات و قیمت هر محصول",
        "افزودن محصول به سبد خرید",
        "طراحی ریسپانسیو برای اندازه‌های مختلف صفحه",
        "توسعه‌ی سریع و کارایی خوب با Vite",
      ],
    },
    image: "/images/projects/nova-store.webp",
    alt: {
      en: "Screenshot of the Nova Store e-commerce storefront showing the product list",
      fa: "تصویر صفحه‌ی لیست محصولات فروشگاه اینترنتی Nova Store",
    },
    tech: ["React", "JavaScript", "Vite", "CSS", "ESLint"],
    liveUrl: "https://nova-store-steel.vercel.app/",
    repoUrl: "https://github.com/samanyarzada/Nova-Store",
  },

  {
    id: "course-hub",
    title: { en: "CourseHub", fa: "CourseHub" },
    summary: {
      en: "A course enrollment dashboard. Students browse available courses, filter them by category, build a semester schedule and see their enrollment status (part-time or full-time) update in real time.",
      fa: "یک داشبورد ثبت‌نام در کورس. محصل کورس‌ها را می‌بیند، بر اساس دسته فیلتر می‌کند، برنامه‌ی سمستر می‌سازد و وضعیت ثبت‌نامش (پاره‌وقت یا تمام‌وقت) را به‌صورت زنده می‌بیند.",
    },
    highlights: {
      en: [
        "Course catalog with code, instructor, credits and schedule",
        "Category filter: Computer Science, Design or Business",
        "My Schedule: add and remove courses instantly",
        "Enrollment summary with credits and a progress bar",
        "Light and dark theme, and selected courses survive a refresh",
      ],
      fa: [
        "فهرست کورس‌ها با کد، استاد، کریدت و زمان‌بندی",
        "فیلتر دسته‌بندی: کامپیوتر ساینس، طراحی یا بیزنس",
        "برنامه‌ی من: افزودن و حذف فوری کورس‌ها",
        "خلاصه‌ی ثبت‌نام با مجموع کریدت و نوار پیشرفت",
        "تم روشن و تیره، و کورس‌های انتخاب‌شده بعد از رفرش می‌مانند",
      ],
    },
    image: "/images/projects/course-hub.webp",
    alt: {
      en: "Screenshot of the CourseHub app showing the course catalog and the My Schedule panel",
      fa: "تصویر اپلیکیشن CourseHub با فهرست کورس‌ها و بخش برنامه‌ی من",
    },
    tech: ["React", "Vite", "CSS Variables", "localStorage"],
    liveUrl: "https://coursehub-react-ecru.vercel.app/",
    repoUrl: "https://github.com/samanyarzada/coursehub-react",
  },

  {
    id: "stock-monitor",
    title: { en: "Stationery Stock Monitor", fa: "Stationery Stock Monitor" },
    summary: {
      en: "A responsive stationery inventory manager built with plain HTML, CSS and vanilla JavaScript, with no framework and no backend. It tracks stock levels, records sales and restocks, and shows the inventory value at a glance.",
      fa: "یک ابزار ریسپانسیو برای مدیریت موجودی لوازم تحریر که با HTML و CSS و جاوااسکریپت خالص ساخته شده، بدون فریم‌ورک و بدون بک‌اند. سطح موجودی را دنبال می‌کند، فروش و تأمین مجدد را ثبت می‌کند و ارزش موجودی را یک‌جا نشان می‌دهد.",
    },
    highlights: {
      en: [
        "Add, edit and delete products, with confirmation before delete",
        "Search, filter by category and status, and sort the list",
        "Summary cards, a value-by-category chart and an activity log",
        "Export to CSV, and data saved in the browser",
        "Light and dark theme, English and Persian with full RTL layout",
      ],
      fa: [
        "افزودن، ویرایش و حذف محصول، با تأیید قبل از حذف",
        "جستجو، فیلتر بر اساس دسته و وضعیت و مرتب‌سازی لیست",
        "کارت‌های خلاصه، نمودار ارزش به تفکیک دسته و گزارش فعالیت‌ها",
        "خروجی CSV و ذخیره‌ی داده‌ها در مرورگر",
        "تم روشن و تیره، انگلیسی و فارسی با چیدمان کامل راست‌به‌چپ",
      ],
    },
    image: "/images/projects/stock-monitor.webp",
    alt: {
      en: "Screenshot of the Stationery Stock Monitor showing the product table and summary cards",
      fa: "تصویر ابزار Stationery Stock Monitor با جدول محصولات و کارت‌های خلاصه",
    },
    tech: ["HTML", "CSS", "JavaScript", "localStorage"],
    liveUrl: "https://stationery-stock-monitor.vercel.app/",
    repoUrl: "https://github.com/samanyarzada/Stationery-Stock-Monitor",
  },

  {
    id: "ledgerline",
    title: { en: "Ledgerline UI", fa: "Ledgerline UI" },
    summary: {
      en: "A professional accounting dashboard UI kit where the theme and the language are switched entirely with CSS, without any JavaScript. It includes smooth animated charts and a layout that mirrors automatically for Persian.",
      fa: "یک نمونه‌ی رابط کاربری حرفه‌ای برای سیستم حسابداری که تم و زبان آن کاملاً با CSS و بدون هیچ JavaScript عوض می‌شود. نمودارهای انیمیشنی روان دارد و برای فارسی چیدمانش خودکار آینه می‌شود.",
    },
    highlights: {
      en: [
        "Light and dark theme with design tokens (CSS variables)",
        "English and Persian (RTL) using CSS logical properties",
        "Animated line charts and a CSS-only donut chart",
        "Heartbeat-style live line animation",
        "Responsive sidebar and reduced-motion support",
      ],
      fa: [
        "تم روشن و تیره با توکن‌های طراحی (متغیرهای CSS)",
        "انگلیسی و فارسی (راست‌به‌چپ) با ویژگی‌های منطقی CSS",
        "نمودار خطی انیمیشنی و نمودار دونات فقط با CSS",
        "انیمیشن خط زنده به سبک ضربان قلب",
        "سایدبار ریسپانسیو و پشتیبانی از کاهش حرکت",
      ],
    },
    image: "/images/projects/ledgerline.webp",
    alt: {
      en: "Screenshot of the Ledgerline accounting dashboard with animated charts and a sidebar",
      fa: "تصویر داشبورد حسابداری Ledgerline با نمودارهای انیمیشنی و سایدبار",
    },
    tech: ["HTML", "CSS", "SVG"],
    liveUrl: "https://ledgerline-ui.vercel.app/",
    repoUrl: "https://github.com/samanyarzada/ledgerline-ui",
  },
];