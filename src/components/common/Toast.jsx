import React from "react";
import "../css/others/toast.css";
import { useTranslation } from "react-i18next";
// import "../css/others/";
function Toast({ toast }) {
  // hook الترجمة
  const { t, i18n } = useTranslation();
  return (
    <div className={`toast ${toast.active ? "active" : ""}`}>
      {/* <span>{toast.text}</span> */}
      <span className={`${toast.type}`}>{t(`${toast.text}`)}</span>
    </div>
  );
}

export default Toast;
