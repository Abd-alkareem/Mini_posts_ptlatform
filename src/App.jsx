import { useEffect, useState } from "react";
import "./App.css";
import { useTranslation } from "react-i18next";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
// icons
import { IoLanguageSharp } from "react-icons/io5";
// icons
// components
import WelcomePage from "./components/pages/main/WelcomePage.jsx";
import { BounceLoader, HashLoader } from "react-spinners";
import Login from "./components/pages/main/Login.jsx";
import SignUP from "./components/pages/main/SignUP.jsx";
import Sidebar from "./components/navigation/Sidebar.jsx";
import UserLayout from "./components/layout/UserLayout.jsx";
// components
// logic management
import { useAuth } from "./components/context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { Toaster } from "react-hot-toast";
// logic management

function App() {
  // import the controle states from the context
  const { loader, setLoader, isAuth, authedUser } = useAuth();
  const { i18n } = useTranslation(); // teanslate hook
  const navigate = useNavigate(); // navigate obj
  // state for main path
  const [mainPath, setMainPath] = useState("");
  // هذا الجزء هو المسؤول عن تغيير اتجاه الموقع بالكامل
  useEffect(() => {
    // جلب اللغة الحالية
    const currentLang = i18n.language;
    // تحديد الاتجاه بناءً على اللغة
    const dir = currentLang === "ar" ? "rtl" : "ltr";
    // تطبيق الاتجاه على وسم الـ html الرئيسي في المتصفح
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
  }, [i18n.language]); // سيعمل الكود في كل مرة تتغير فيها اللغة

  // useEffect to declare the main path depending on role
  useEffect(() => {
    if (isAuth) {
      authedUser.role === "normal" ? setMainPath("user") : setMainPath("admin");
    } else {
      setMainPath("");
    }
  }, [isAuth]);

  // useEffect to controle the path of cooke deleted
  useEffect(() => {
    if (loader) return;
    const publicPages = ["/", "/login", "/sign-up"];
    if (!isAuth && !publicPages.includes(location.pathname)) {
      navigate(`/`, { replace: true });
    }
  }, [isAuth, location.pathname]);

  // useEffect that will catch evry move on pathes and controle it
  useEffect(() => {
    // قائمة الصفحات التي لا نريد للمستخدم المسجل دخولها (Welcome, Login, SignUp)
    const publicPages = ["/", "/login", "/sign-up"];

    if (isAuth && mainPath && publicPages.includes(location.pathname)) {
      // إذا كان مسجل دخول ويحاول دخول صفحة عامة، ارسله فوراً لمساره الصحيح
      navigate(`/${mainPath}`, { replace: true });
    }
  }, [isAuth, mainPath, location.pathname, navigate]);

  // open close language menu
  const [openLang, setOpenLang] = useState(false);

  return (
    <div className="app">
      {/* the loader that will be on top of any page */}
      {loader && (
        <div className="loader-div">
          {/* <HashLoader className="spinner" color="#314755" /> */}
          <BounceLoader className="spinner" color="#314755" />
        </div>
      )}

      {/* language setting par that will be on top of any page */}
      <div className={`language-setting ${openLang ? "active" : ""}`}>
        <span
          className={`${i18n.language === "ar" ? "active" : ""} ar-font`}
          onClick={() => {
            i18n.changeLanguage("ar");
            setOpenLang(false);
          }}
        >
          العربية
        </span>
        <span
          className={`${i18n.language === "en" ? "active" : ""} en-font`}
          onClick={() => {
            i18n.changeLanguage("en");
            setOpenLang(false);
          }}
        >
          ENGILSH
        </span>
        <IoLanguageSharp
          className={`lang-btn`}
          onClick={() => {
            setOpenLang(!openLang);
            setLoader(true);
            setTimeout(() => {
              setLoader(false);
            }, 1000);
          }}
        />
      </div>

      {/* MAIN toast for all websit */}
      <div>
        <Toaster />
      </div>
      {/* routes */}
      <Routes>
        {/* public paths for all people */}
        <Route path="/" element={<WelcomePage />} />
        <Route
          path="/login"
          element={
            isAuth ? <Navigate to={`/${mainPath}`} replace /> : <Login />
          }
        />
        <Route
          path="/sign-up"
          element={
            isAuth ? <Navigate to={`/${mainPath}`} replace /> : <SignUP />
          }
        />

        {/* website in case there is account user/admin */}
        {isAuth && (
          <Route
            path="/*"
            element={
              <>
                <Sidebar />
                <div className="main-section">
                  <Routes>
                    <Route
                      path="/user/*"
                      element={
                        <ProtectedRoute allowedRoles={["normal"]}>
                          <UserLayout />
                        </ProtectedRoute>
                      }
                    />

                    {/* default path when isAuth */}
                    {/* <Route
                      path="*"
                      element={<Navigate to={`/${mainPath}`} replace />}
                    /> */}
                  </Routes>
                </div>
              </>
            }
          />
        )}

        {/* صفحة تنبيه عند محاولة دخول مكان غير مسموح */}
        <Route path="/unauthorized" element={<></>} />
      </Routes>
    </div>
  );
}

export default App;
