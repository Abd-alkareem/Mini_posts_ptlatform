import axios from "axios";

const api = axios.create({
  // الرابط الأساسي للسيرفر (غيره لاحقاً لرابط الاستضافة)
  baseURL: "//mini-posts-ptlatform.rf.gd/api/",
  timeout: 10000, // مدة الانتظار قبل اعتبار الطلب فاشلاً (10 ثوانٍ)
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// ميزة الـ Interceptors: سنستخدمها لاحقاً لإرسال الـ Token تلقائياً
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("user_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

export default api;

/*
import api from '../api/axiosConfig';

const handleSignUp = async (formData) => {
    try {
        const response = await api.post('signup.php', formData);
        console.log("تم إنشاء الحساب بنجاح:", response.data);
    } catch (error) {
        console.error("خطأ في التسجيل:", error.response?.data || error.message);
    }
};
*/

// ملف الاتصال قبل الرفع
// const api = axios.create({
//   // الرابط الأساسي للسيرفر (غيره لاحقاً لرابط الاستضافة)
//   baseURL: "http://localhost/posts_platform/api/",
//   timeout: 10000, // مدة الانتظار قبل اعتبار الطلب فاشلاً (10 ثوانٍ)
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
//   withCredentials:true,
// });
