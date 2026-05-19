import React, { useEffect, useRef, useState } from "react";
import bgImg from "../../../assets/images/landing-page.jpg"; //bg image
import api from "../../../api/axiosConfig"; // axios request obj
import { toast } from "react-hot-toast"; // import toast
// icons
import { FaLock, FaUser, FaEye, FaIdCard, FaEyeSlash } from "react-icons/fa";
import { CiAt, CiWarning } from "react-icons/ci";
import { IoShieldCheckmark } from "react-icons/io5";

// icons
import "../../css/signUp.css"; // css
import { useTranslation } from "react-i18next"; // hook for translate
import { useNavigate } from "react-router-dom"; // hook for navigator obj
import { useAuth } from "../../context/AuthContext"; // hood for Context

//array of inputs
const signupFields = [
  {
    name: "full_name",
    type: "text",
    label: "full_name_label",
    icon: FaIdCard,
    error_message: "name_field",
  },
  {
    name: "username",
    type: "text",
    label: "username_label",
    icon: FaUser,
    error_message: "username_field",
  },
  {
    name: "email",
    type: "email",
    label: "email_label",
    icon: CiAt,
    error_message: "email_field",
  },
  {
    name: "password",
    type: "password",
    label: "password_label",
    icon: FaLock,
    error_message: "password_field",
  },
  {
    name: "confirmPassword",
    type: "password",
    label: "confirm_password_label",
    icon: IoShieldCheckmark,
    error_message: "confirm_password",
  },
];
function SignUP() {
  // hook الترجمة
  const { t, i18n } = useTranslation();
  // navigatoer obj
  const navigate = useNavigate();
  // import setLoader from Context
  const { setLoader } = useAuth();
  // state for errors
  const [errors, setErrors] = useState({});
  // errors for avaliable values (user , email)
  const [avaliableErrors, setAvaliableErrors] = useState({});
  // غرض يخزن اسم كل حقل والحالة الخاصة به مخفي أو لا .
  const [visiblePasswords, setVisiblePasswords] = useState({});
  // refreanc for setTimeout to delete it
  const loaderTimerRef = useRef(null);
  // useEffect to clear Timeout
  useEffect(() => {
    return () => {
      // تنظيف أي تايمر شغال عند خروج المستخدم من الصفحة
      if (loaderTimerRef.current) clearTimeout(loaderTimerRef.current);
    };
  }, []);
  // تابع يخزن الحالة الحالية للحقل باسمه وعكس الحالة السابقة
  const toggleVisibility = (name) => {
    setVisiblePasswords((prev) => ({
      ...prev, // مضمنة في تابع set المضمن في stste
      [name]: !prev[name], // يعكس الحالة للحقل المحدد فقط
    }));
  };

  // the payload for the register request
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  // hundling payload's changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev, // انسخ القيم القديمة
      [name]: value, // حدث الحقل الذي تغير فقط
    }));
    // تصفير ليستت الأخطاء المتعلقة بالأسماء المتاحة
    setAvaliableErrors((prev) => ({ ...prev, [name]: "" }));
  };
  // ----- validation reg ------
  const NAME_REGEX = /^[\u0600-\u06FFa-zA-Z0-9\s\-]{3,50}$/; // for full name
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // for email
  const PASSWORD_REGEX = /^[A-Za-z0-9!@#$%_-]{8,}$/; // for pass
  const LINK_REGEX = /(http|https|www\.|\.com|\.net|\.org)/i; // for block links
  const HTML_REGEX = /<[^>]*>/; // for block html tags
  const USERNAME_REGEX = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{2,29}$/; // for username
  const VALIDATION_RULES = {
    full_name: NAME_REGEX,
    username: USERNAME_REGEX,
    email: EMAIL_REGEX,
    password: PASSWORD_REGEX,
  };
  // validation on blur
  const handleBlur = async (e) => {
    const { name, value } = e.target;
    // console.log({ name, value });
    // 1. ابحث هل لهذا الحقل قاعدة فحص في القاموس؟
    const rule = VALIDATION_RULES[name];

    // التحقق اللحظي لكل الحقول عدلناه ليكون فقط لحقلي يووزر و ايميل
    if (name === "username" || name === "email") {
      // step 1 : clear the errors when the field is empty and dont do the validation
      if (value.trim() === "") {
        setErrors((prev) => {
          const newErrs = { ...prev };
          delete newErrs[name];
          return newErrs;
        });
      } else if (rule) {
        // step 2 : of the field not epmty do the validation and deal with errors
        // 2. إذا وجدنا قاعدة، نختبر القيمة
        if (!rule.test(value)) {
          setErrors((prev) => ({
            ...prev,
            [name]: `قيمة ${name} غير صالحة`, // يمكنك تحسين الرسالة لاحقاً عبر الترجمة t()
          }));
        } else {
          // 3. إذا كانت صحيحة، نحذف الخطأ الخاص بهذا الحقل فقط
          setErrors((prev) => {
            const newErrs = { ...prev };
            delete newErrs[name];
            return newErrs;
          });
        }
      }
    }

    // التحقق من أن اليوزر والإيميل فريدان
    if ((name === "username" || name === "email") && value.trim() !== "") {
      try {
        const response = await api.post("/auth/check_unique.php", {
          name,
          value,
        });
        // إذا كان موجوداً (exists: true)
        if (response.data.exists) {
          setAvaliableErrors((prev) => ({
            ...prev,
            [name]: t(`sign_up_errors_message.${response.data.message}`),
          }));
          // console.log(response.data);
        } else {
          // مهم جداً: إذا كان متاحاً الآن، احذف الخطأ السابق (إن وجد)
          setAvaliableErrors((prev) => {
            const newErrs = { ...prev };
            delete newErrs[name];
            return newErrs;
          });
        }
      } catch (error) {
        console.error("خطأ في الاتصال بالسيرفر", error);
      }
    } else if (value.trim() === "") {
      // إذا أصبح الحقل فارغاً، نظف رسائل الخطأ المتعلقة بالـ "التوفر" (Availability)
      setAvaliableErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[name];
        return newErrs;
      });
    }
  };
  // ----- validation reg ------

  // hundel Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // 1. فحص كل الحقول الموجودة في formData
    Object.keys(formData).forEach((fieldName) => {
      const value = formData[fieldName];

      // أ - فحص القواعد الأساسية (Regex الذي عرفناه سابقاً)
      const rule = VALIDATION_RULES[fieldName];
      if (rule && !rule.test(value)) {
        newErrors[fieldName] = true;
      }

      // ب - فحص الروابط (LINK_REGEX)
      if (fieldName !== "email") {
        if (LINK_REGEX.test(value)) {
          newErrors[fieldName] = true;
          console.log(t("sign_up_errors_message.no_links_allowed"));
        }
      }
      // ج - فحص أكواد HTML (HTML_REGEX)
      if (HTML_REGEX.test(value)) {
        newErrors[fieldName] = true;
        console.log(t("sign_up_errors_message.no_html_allowed"));
      }
    });

    // 2. التحقق من تطابق كلمتي المرور
    if (formData.password !== formData.confirmPassword) {
      newErrors["confirmPassword"] = true;
    }

    // 3. تحديث حالة الأخطاء
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      // console.log("إيقاف الإرسال: يوجد أخطاء", newErrors);
      return; // اخرج من الدالة فوراً ولا تنفذ أي Fetch
    }
    // 4. إذا لم يوجد أي خطأ، ننتقل للـ PHP
    if (Object.keys(newErrors).length === 0) {
      // turn on the loader
      setLoader(true);
      // هنا سنضع كود الـ Fetch للـ PHP لاحقاً
      try {
        const response = await api.post("/auth/register.php", formData);
        // إذا كان موجوداً (exists: true)
        if (response) {
          // إظهار تواست النجاح مع النص المترجم
          toast.success(t("sign_up_toasts.created_succfully"));
          // التوجيه لصفحة اللوجن بعد نجاح العملية
          loaderTimerRef.current = setTimeout(() => {
            setLoader(false);
            navigate("/login");
          }, 2000);
        }
      } catch (error) {
        setLoader(false);
        // إظهار تواست الخطأ (يفضل وضع نص ترجمة خاص بالخطأ هنا)
        toast.error(t("sign_up_toasts.error_on_create") || "Error occured");
        console.error("خطأ في الاتصال بالسيرفر", error);
        loaderTimerRef.current = setTimeout(() => {
          setLoader(false);
        }, 2000);
      }
    }
  };
  // };
  return (
    <div className="sign_up-page">
      <img src={bgImg} alt="" className="bg-image" />
      <div className="form-div">
        <div className="form-title">{t(`sign_up.form_title`)}</div>
        <form
          action=""
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          {signupFields.map((btn, idx) => (
            <div key={idx}>
              <div className="in-fild">
                <span className="i-box">
                  <btn.icon className="i" />
                </span>
                <input
                  type={
                    // اذا كان حقل باسسورد تحقق من حالة الظهور
                    btn.type === "password" && visiblePasswords[btn.name]
                      ? "text"
                      : // الحقول الأخرى أنزلها كما هي
                        btn.type
                  }
                  name={btn.name}
                  placeholder={` ${t(`sign_up.${btn.label}`)}`}
                  onChange={handleChange} // نستخدم onChange بدلاً من onClick
                  onBlur={handleBlur}
                  autoComplete="off"
                />
                {btn.type === "password" && (
                  <span
                    className="pass-i"
                    onClick={(e) => toggleVisibility(btn.name)}
                  >
                    {visiblePasswords[btn.name] ? <FaEyeSlash /> : <FaEye />}
                  </span>
                )}
              </div>
              {errors[btn.name] ? (
                <div className="error-message">
                  <span>
                    <CiWarning className="error-icon" />
                  </span>
                  <span className="error-text">
                    {t(`sign_up_errors_message.${btn.error_message}`)}
                  </span>
                </div>
              ) : (
                <>
                  {avaliableErrors[btn.name] && (
                    <div className="error-message">
                      <span className="error-icon">⚠️</span>
                      <span className="error-text">
                        {avaliableErrors[btn.name]}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
          <input
            type="submit"
            value={t(`sign_up.sign_up_btn`)}
            className="sign_up-btn"
          />
        </form>
      </div>
    </div>
  );
}

export default SignUP;
