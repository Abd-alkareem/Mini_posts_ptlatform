import i18n from "i18next"; // المكتبة الأم المسؤولة عن منطق الترجمة بالكامل.
import { initReactI18next } from "react-i18next"; // الجسر الذي يربط i18next بمكونات React (Hooks).
import Backend from "i18next-http-backend"; // المسؤول عن جلب ملفات JSON من السيرفر (مجلد public) بدلاً من استيرادها يدوياً.
import LanguageDetector from "i18next-browser-languagedetector"; // الأداة التي تتعرف على لغة المستخدم (من المتصفح أو الكوكيز).

i18n
  .use(Backend) // تفعيل خاصية جلب الملفات عبر طلبات HTTP (AJAX).
  .use(LanguageDetector) // تفعيل أداة الكشف التلقائي عن اللغة وتخزينها.
  .use(initReactI18next) // إخبار i18next أننا سنستخدمه داخل بيئة React.
  .init({
    debug: true, // يظهر لك في الـ Console كل ما يحدث (مثل: هل تم تحميل الملف بنجاح؟ ما هي اللغة المكتشفة؟). مفيد جداً للتطوير.

    // إعدادات الكشف والتخزين
    detection: {
      order: ["cookie", "localStorage", "htmlTag", "navigator"],
      // الترتيب: ابحث أولاً في الكوكيز، ثم التخزين المحلي، ثم وسم html، وأخيراً لغة المتصفح.
      caches: ["cookie", "localStorage"],
      // أين نحفظ لغة المستخدم عندما يغيرها؟ (سيحفظها في الكوكيز والـ localStorage معاً).
    },

    // إعدادات المسار لملفات الـ JSON
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
      // الرابط الذي سيطلب منه المتصفح الملفات.
      // {{lng}} تتغير تلقائياً إلى ar أو en.
      // {{ns}} هو اسم الملف (الافتراضي هو translation).
    },

    // 4. الإعدادات العامة
    fallbackLng: "ar", // "اللغة الاحتياطية"؛ إذا طلب المستخدم لغة غير موجودة، سيعرض له العربية.
    interpolation: {
      escapeValue: false, // React يقوم بحماية البيانات من الـ XSS تلقائياً، لذا نوقفها هنا لتوفير الأداء.
    },

    // 5. إضافة اختيارية: الانتظار حتى يتم تحميل الملفات
    react: {
      useSuspense: true, // يخبر React بأن ينتظر (Wait) حتى ينتهي تحميل ملفات الـ JSON قبل عرض المكونات.
    },
  });

export default i18n;
