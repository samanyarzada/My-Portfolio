
export const categories = [
  { id: "react", name: { en: "React", fa: "ری‌اکت" } },
  { id: "css", name: { en: "CSS", fa: "سی‌اس‌اس" } },
  { id: "javascript", name: { en: "JavaScript", fa: "جاوااسکریپت" } },
  { id: "career", name: { en: "Career", fa: "مسیر شغلی" } },
];

// Decorative text shown on the cover of each category
export const coverSymbols = {
  react: "<App />",
  css: "{ }",
  javascript: "JS",
  career: "→",
};


  // ... مقاله‌ها بدون تغییر
export const posts = [
  {
    id: 1,
    slug: "react-router-introduction",
    category: "react",
    tags: ["react", "routing", "beginner"],
    date: "2026-09-28",
    readTime: 6,
    featured: true,
    title: {
      en: "React Router Introduction: Routing Without the Confusion",
      fa: "مقدمه‌ای بر React Router: مسیریابی بدون سردرگمی",
    },
    excerpt: {
      en: "A clear look at routes, nested layouts and dynamic params, with the mistakes beginners make most often.",
      fa: "نگاهی روشن به Routeها، Layoutهای تو در تو و پارامترهای داینامیک، همراه با رایج‌ترین اشتباه‌های مبتدی‌ها.",
    },
    content: {
      en: [
        "Routing is what turns a single React page into a real multi-page experience. React Router gives you the tools to map URLs to components without reloading the browser.",
        "Start with BrowserRouter, Routes and Route. Every Route connects a path to an element, and the first matching route is rendered.",
        "Nested routes and the Outlet component let you share a layout, such as a navbar and footer, across many pages without repeating code.",
        "Dynamic segments like /blog/:slug are read with useParams. This is how one component can display any article.",
      ],
      fa: [
        "مسیریابی چیزی است که یک صفحه‌ی React را به یک تجربه‌ی چندصفحه‌ای واقعی تبدیل می‌کند. React Router ابزار نگاشت آدرس‌ها به کامپوننت‌ها را بدون بارگذاری دوباره‌ی مرورگر در اختیارت می‌گذارد.",
        "با BrowserRouter و Routes و Route شروع کن. هر Route یک مسیر را به یک المان وصل می‌کند و اولین مسیر منطبق نمایش داده می‌شود.",
        "Routeهای تو در تو و کامپوننت Outlet به تو اجازه می‌دهند یک Layout مشترک، مثل Navbar و Footer، را بدون تکرار کد در صفحه‌های زیادی استفاده کنی.",
        "بخش‌های داینامیک مثل /blog/:slug با useParams خوانده می‌شوند. به همین شکل یک کامپوننت می‌تواند هر مقاله‌ای را نمایش دهد.",
      ],
    },
  },
  {
    id: 2,
    slug: "css-glassmorphism-guide",
    category: "css",
    tags: ["css", "ui", "design"],
    date: "2026-09-15",
    readTime: 5,
    featured: false,
    title: {
      en: "Glassmorphism in CSS: Build Frosted Glass Cards",
      fa: "گلس‌مورفیسم در CSS: ساخت کارت‌های شیشه‌ای مات",
    },
    excerpt: {
      en: "How backdrop-filter, soft borders and layered gradients create depth without hurting readability.",
      fa: "چگونه backdrop-filter و حاشیه‌های نرم و گرادیان‌های لایه‌ای عمق می‌سازند، بدون این‌که خوانایی کم شود.",
    },
    content: {
      en: [
        "Glassmorphism is a style built on blur, transparency and subtle light. The key property is backdrop-filter, which blurs whatever is behind an element.",
        "A thin semi-transparent border and a light gradient on top make the card feel like real glass instead of a flat box.",
        "Always check text contrast. A beautiful card is useless if people cannot read it.",
      ],
      fa: [
        "گلس‌مورفیسم سبکی است که بر تاری، شفافیت و نور ظریف ساخته می‌شود. ویژگی کلیدی آن backdrop-filter است که هر چیزی را پشت یک المان محو می‌کند.",
        "یک حاشیه‌ی نازک نیمه‌شفاف و یک گرادیان روشن در بالا، کارت را شبیه شیشه‌ی واقعی می‌کند، نه یک جعبه‌ی تخت.",
        "همیشه کنتراست متن را بررسی کن. کارت زیبا اگر خوانا نباشد بی‌فایده است.",
      ],
    },
  },
  {
    id: 3,
    slug: "javascript-array-methods",
    category: "javascript",
    tags: ["javascript", "arrays", "beginner"],
    date: "2026-08-30",
    readTime: 7,
    featured: false,
    title: {
      en: "JavaScript Array Methods You Will Use Every Day",
      fa: "متدهای آرایه در جاوااسکریپت که هر روز استفاده می‌کنی",
    },
    excerpt: {
      en: "map, filter, find and reduce explained with small, practical examples from real UI work.",
      fa: "توضیح map و filter و find و reduce با مثال‌های کوچک و کاربردی از کار واقعی رابط کاربری.",
    },
    content: {
      en: [
        "Array methods are the daily tools of a front-end developer. map transforms every item, filter keeps only the items you want, and find returns the first match.",
        "reduce is the most flexible one. It folds an array into a single value, such as a total price or a grouped object.",
        "In React you will use these methods to render lists, search and filter data.",
      ],
      fa: [
        "متدهای آرایه ابزار روزانه‌ی یک توسعه‌دهنده‌ی فرانت‌اند هستند. map هر آیتم را تغییر می‌دهد، filter فقط آیتم‌های دلخواه را نگه می‌دارد و find اولین مورد منطبق را برمی‌گرداند.",
        "reduce انعطاف‌پذیرترین آن‌هاست. یک آرایه را به یک مقدار واحد، مثل مجموع قیمت یا یک شیء گروه‌بندی‌شده، تبدیل می‌کند.",
        "در React از این متدها برای نمایش لیست‌ها، جستجو و فیلتر داده‌ها استفاده می‌کنی.",
      ],
    },
  },
  {
    id: 4,
    slug: "my-front-end-learning-path",
    category: "career",
    tags: ["career", "learning", "student"],
    date: "2026-08-12",
    readTime: 4,
    featured: false,
    title: {
      en: "My Front-End Learning Path as a Student",
      fa: "مسیر یادگیری فرانت‌اند من به‌عنوان یک محصل",
    },
    excerpt: {
      en: "From HTML and CSS to React and the Meta certificate: what worked, what did not, and what I would repeat.",
      fa: "از HTML و CSS تا React و گواهی Meta: چه چیزی جواب داد، چه چیزی نداد و چه چیزی را دوباره انجام می‌دهم.",
    },
    content: {
      en: [
        "I started with HTML and CSS, then moved to JavaScript and React. Building small projects taught me more than watching tutorials.",
        "The Meta Front-End Developer course on Coursera gave me structure and a clear order of topics.",
        "Teaching computer science and math also helped. Explaining something to others is the fastest way to find the gaps in your own knowledge.",
      ],
      fa: [
        "من با HTML و CSS شروع کردم و بعد به جاوااسکریپت و React رسیدم. ساختن پروژه‌های کوچک بیشتر از دیدن آموزش‌ها به من یاد داد.",
        "دوره‌ی Meta Front-End Developer در Coursera به من ساختار و ترتیب روشنی از موضوع‌ها داد.",
        "تدریس کامپیوتر و ریاضی هم کمک کرد. توضیح دادن یک موضوع به دیگران سریع‌ترین راه برای پیدا کردن خلأهای دانش خودت است.",
      ],
    },
  },
  {
    id: 5,
    slug: "tailwind-vs-plain-css",
    category: "css",
    tags: ["css", "tailwind", "workflow"],
    date: "2026-07-25",
    readTime: 5,
    featured: false,
    title: {
      en: "Tailwind CSS vs Plain CSS: Which Should You Pick?",
      fa: "Tailwind CSS یا CSS ساده: کدام را انتخاب کنیم؟",
    },
    excerpt: {
      en: "An honest comparison of speed, readability and control, from someone who uses both.",
      fa: "مقایسه‌ای صادقانه از سرعت، خوانایی و کنترل، از زبان کسی که هر دو را استفاده می‌کند.",
    },
    content: {
      en: [
        "Tailwind gives you speed. You style directly in the markup and never leave the file.",
        "Plain CSS gives you control and cleaner markup, especially in projects with a strong custom design system.",
        "Learn plain CSS first. Tailwind makes much more sense once you understand what each utility does underneath.",
      ],
      fa: [
        "Tailwind به تو سرعت می‌دهد. مستقیم در مارک‌آپ استایل می‌دهی و از فایل بیرون نمی‌روی.",
        "CSS ساده به تو کنترل و مارک‌آپ تمیزتر می‌دهد، مخصوصاً در پروژه‌هایی با سیستم طراحی سفارشی قوی.",
        "اول CSS ساده را یاد بگیر. وقتی بفهمی هر کلاس Tailwind در پشت صحنه چه کاری می‌کند، استفاده از آن خیلی معنادارتر می‌شود.",
      ],
    },
  },
  {
    id: 6,
    slug: "react-state-and-props",
    category: "react",
    tags: ["react", "state", "props"],
    date: "2026-07-05",
    readTime: 6,
    featured: false,
    title: {
      en: "React State and Props: The Mental Model",
      fa: "State و Props در React: مدل ذهنی درست",
    },
    excerpt: {
      en: "Stop memorizing syntax. Understand who owns data and how it flows through your components.",
      fa: "حفظ کردن سینتکس را کنار بگذار. بفهم داده مال کیست و چگونه بین کامپوننت‌ها جریان می‌یابد.",
    },
    content: {
      en: [
        "Props are data passed down from a parent. State is data a component owns and can change.",
        "When state changes, React renders the component again. That is the whole idea behind reactive interfaces.",
        "If two components need the same data, move the state up to their closest common parent.",
      ],
      fa: [
        "Props داده‌ای است که از والد به پایین پاس داده می‌شود. State داده‌ای است که کامپوننت مالک آن است و می‌تواند تغییرش دهد.",
        "وقتی state تغییر کند، React کامپوننت را دوباره رندر می‌کند. تمام ایده‌ی رابط‌های واکنشی همین است.",
        "اگر دو کامپوننت به یک داده‌ی مشترک نیاز دارند، state را به نزدیک‌ترین والد مشترکشان ببر.",
      ],
    },
  },
  {
    id: 7,
    slug: "responsive-design-checklist",
    category: "css",
    tags: ["css", "responsive", "mobile"],
    date: "2026-06-18",
    readTime: 5,
    featured: false,
    title: {
      en: "A Practical Responsive Design Checklist",
      fa: "چک‌لیست کاربردی طراحی ریسپانسیو",
    },
    excerpt: {
      en: "Grid, clamp, logical properties and a few habits that make layouts work on every screen.",
      fa: "Grid و clamp و Logical Properties و چند عادت که چیدمان را روی هر صفحه‌ای درست کار می‌کند.",
    },
    content: {
      en: [
        "Design mobile first, then add breakpoints only when the layout actually breaks.",
        "Use CSS Grid with auto-fill and minmax for card lists. Use clamp for fluid font sizes.",
        "Logical properties like margin-inline-start make one stylesheet work for both left-to-right and right-to-left languages.",
      ],
      fa: [
        "اول برای موبایل طراحی کن و فقط وقتی چیدمان واقعاً خراب شد breakpoint اضافه کن.",
        "برای لیست کارت‌ها از CSS Grid با auto-fill و minmax استفاده کن. برای اندازه‌ی فونت روان از clamp استفاده کن.",
        "Logical Properties مثل margin-inline-start باعث می‌شوند یک استایل‌شیت هم برای زبان‌های چپ‌به‌راست و هم راست‌به‌چپ کار کند.",
      ],
    },
  },
  {
    id: 8,
    slug: "how-to-teach-yourself-code",
    category: "career",
    tags: ["career", "learning", "habits"],
    date: "2026-06-02",
    readTime: 4,
    featured: false,
    title: {
      en: "How to Teach Yourself to Code and Stay Consistent",
      fa: "چگونه برنامه‌نویسی را خودآموز یاد بگیریم و منظم بمانیم",
    },
    excerpt: {
      en: "Small daily sessions, real projects and honest reviews beat long, irregular study marathons.",
      fa: "جلسه‌های کوچک روزانه، پروژه‌ی واقعی و بازبینی صادقانه از ماراتن‌های طولانی و نامنظم بهتر است.",
    },
    content: {
      en: [
        "Consistency beats intensity. Thirty focused minutes every day gives more than one exhausting weekend.",
        "Pick a real project early. A project forces you to search, fail and fix, which is where learning actually happens.",
        "Review your own old code every month. The embarrassment you feel is proof that you are growing.",
      ],
      fa: [
        "نظم از شدت مهم‌تر است. سی دقیقه‌ی متمرکز هر روز بیشتر از یک آخر هفته‌ی فرساینده نتیجه می‌دهد.",
        "زود یک پروژه‌ی واقعی انتخاب کن. پروژه تو را مجبور می‌کند جستجو کنی، شکست بخوری و درست کنی، و یادگیری واقعی همان‌جا اتفاق می‌افتد.",
        "هر ماه کدهای قدیمی خودت را مرور کن. خجالتی که حس می‌کنی نشانه‌ی رشد توست.",
      ],
    },
  },
];

// ---------- Helpers ----------

export const getPostBySlug = (slug, list = posts) =>
  list.find((p) => p.slug === slug);

export const getPostsByCategory = (categoryId, list = posts) =>
  list.filter((p) => p.category === categoryId);

export const getPostsByTag = (tag, list = posts) =>
  list.filter((p) => p.tags.includes(tag));

export const getAllTags = (list = posts) =>
  [...new Set(list.flatMap((p) => p.tags))].sort();

export const getCategoryById = (id) => categories.find((c) => c.id === id);