import React, { useEffect, useRef, useState } from "react";
import bgImg from "../../../assets/images/landing-page.jpg"; // bg image
import api from "../../../api/axiosConfig"; // axios request obj
import { toast } from "react-hot-toast"; // import toast

// icons
import { FaUser, FaLock, FaEyeSlash, FaEye } from "react-icons/fa";
// import { IoShieldCheckmark } from "react-icons/io5";
import { CiWarning } from "react-icons/ci";
import { IoIosWarning } from "react-icons/io";

// icons
import "../../css/login.css"; // css
import { useTranslation } from "react-i18next"; // hook for translate
import { Link, useNavigate } from "react-router-dom"; // navigator objet
import { useAuth } from "../../context/AuthContext"; // hook for context
import Toast from "../../common/Toast";

// array of filds for log in form
const log_in_filds = [
  {
    name: "username",
    type: "text",
    lable: "username_label",
    icon: FaUser,
    error_message: "username_field",
  },
  {
    name: "password",
    type: "password",
    lable: "password_label",
    icon: FaLock,
    error_message: "password_field",
  },
];
function Login() {
  // hook الترجمة
  const { t, i18n } = useTranslation();
  // navigatoer obj
  const navigate = useNavigate();
  // improt setLoader function from Context
  const { setLoader } = useAuth();
  // login function imported form Context file
  const { loginUser } = useAuth();
  // state for errors
  const [errors, setErrors] = useState({});
  // visible password state
  const [visiblePassword, setVisiblePassword] = useState(false);
  // the payload for log in request
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  // hundling payload's changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // handle changing values in the field to payoad
    setFormData((prev) => ({
      ...prev, // انسخ القيم القديمة
      [name]: value, // حدث الحقل الذي تغير فقط
    }));

    // check on wrtie on the value to remover the error
    const rule = VALIDATION_RULES[name];
    if (rule && rule.test(value)) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[name];
        return newErrs;
      });
    }
  };

  // refreanc for setTimeout to delete it
  const loaderTimerRef = useRef(null);
  // useEffect to clear Timeout
  useEffect(() => {
    return () => {
      // تنظيف أي تايمر شغال عند خروج المستخدم من الصفحة
      if (loaderTimerRef.current) clearTimeout(loaderTimerRef.current);
    };
  }, []);

  // ----- VALIDATOIN ------
  const PASSWORD_REGEX = /^[A-Za-z0-9!@#$%_-]{8,}$/; // for pass
  const LINK_REGEX = /(http|https|www\.|\.com|\.net|\.org)/i; // for block links
  const HTML_REGEX = /<[^>]*>/; // for block html tags
  const USERNAME_REGEX = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{2,29}$/; // for username
  // object to manage the validation rules
  const VALIDATION_RULES = {
    username: USERNAME_REGEX,
    password: PASSWORD_REGEX,
  };
  // ----- VALIDATOIN ------

  const handleSubmit = async (e) => {
    e.preventDefault();

    // we will use a temp error's variable to save it cause sueing setErrors directly
    //  ->> will make some proplems with aysnc function
    const tempErrors = {};

    // looping on the fields of payload useing Object.keys to make array from payload keys
    Object.keys(formData).forEach((formKey, idx) => {
      // get the value from payload form
      const value = formData[formKey];
      // get the rule that compatible with the field
      const rule = VALIDATION_RULES[formKey];

      // check on the value useing rule
      if (rule) {
        if (!rule.test(value)) {
          // in case there is error in value
          tempErrors[formKey] = `invalid_${formKey}`;
        } else {
          // in case the user fixed the value we should delete the error
          setErrors((prev) => {
            const newErrs = { ...prev };
            delete newErrs[formKey];
            return newErrs;
          });
        }
      }

      // secound type of check ,check on links in value
      if (LINK_REGEX.test(value)) {
        tempErrors[formKey] = "no_links_allowed";
      }

      // third type of check ,check on Html,js tags in value
      if (HTML_REGEX.test(value)) {
        tempErrors[formKey] = "no_html_allowed";
      }
    });

    // now we use setErrors to save the empErrors in the state
    setErrors(tempErrors);

    // blocking the requset in case there is erroe
    if (Object.keys(tempErrors).length > 0) {
      // console.warn("إيقاف الإرسال: يوجد أخطاء", tempErrors);
      return; // اخرج من الدالة فوراً ولا تنفذ أي Fetch
    }

    // accepting the request in case there is not errors
    if (Object.keys(tempErrors).length === 0) {
      setLoader(true);
      try {
        const response = await api.post("/auth/log_in.php", formData);
        // إذا كان موجوداً (exists: true)
        if (response.data.state === "success") {
          // console.log("تم استلام البيانات وحقنها في الكونتيكست");
          toast.success(t("log_in_toasts.authed_succfully"));
          loaderTimerRef.current = setTimeout(() => {
            setLoader(false);
            loginUser(response.data.user);
          }, 2000);
        } else {
          console.log(response);
          toast.error(t("log_in_toasts.authing_fild") || "Error occured");
          loaderTimerRef.current = setTimeout(() => {
            setLoader(false);
          }, 2000);
        }
      } catch (error) {
        console.error("خطأ في الاتصال بالسيرفر", error);
        toast.error(t("log_in_toasts.error_on_request") || "Error occured");
        loaderTimerRef.current = setTimeout(() => {
          setLoader(false);
        }, 2000);
      }
    }
  };
  return (
    <div className="login-page">
      <img src={bgImg} alt="" className="bg-image" />
      <div className="form-div">
        <span className="form-title"> {t(`log_in.form_title`)}</span>
        <form
          action=""
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          {log_in_filds.map((field, idx) => {
            return (
              <div key={idx}>
                <div className="in-fild">
                  <span className="i-box">
                    <field.icon className="i" />
                  </span>
                  <input
                    type={
                      // there will be a condition to controle the visiblity of password
                      field.type === "password" && visiblePassword
                        ? "text"
                        : field.type
                    }
                    name={field.name}
                    placeholder={` ${t(`log_in.${field.lable}`)}`}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                  {field.type === "password" && (
                    <span
                      className="pass-i"
                      onClick={(e) => setVisiblePassword(!visiblePassword)}
                    >
                      {visiblePassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  )}
                </div>
                {/* display errors message on validation */}
                {errors[field.name] && (
                  <div className="error-message">
                    <span>
                      <IoIosWarning className="error-icon" />
                    </span>
                    <span className="error-text">
                      {t(`sign_up_errors_message.${field.error_message}`)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          <input
            type="submit"
            value={t(`log_in.log_btn`)}
            className="log-btn"
          />
        </form>
        <p>
          {t(`log_in.para`)}
          <Link to={"/sign-up"} className="">
            {`' ${t(`log_in.link`)} '`}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
