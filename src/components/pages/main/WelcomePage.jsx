import React from "react";
import "../../css/welcomePage.css";
import bgImg from "../../../assets/images/landing-page.jpg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
function WelcomePage() {
  // hook الترجمة
  const { t, i18n } = useTranslation();
  return (
    <div className="welcome-page">
      <img src={bgImg} alt="" className="bg-image" />
      {/* main box */}
      <div>
        <span className="first-message">{t(`welcome.first_m`)}</span>
        <p className="description">{t(`welcome.description_1`)}</p>
        <div className="buttons">
          <Link to={`/login`} className="btn">
            {t(`welcome.login_btn`)}
          </Link>
          <Link to={`/sign-up`} className="btn">
            {t(`welcome.sign_up_btn`)}
          </Link>
        </div>
      </div>
      {/* verson bar */}
      <span className="v-bar">v 1.0.0</span>
    </div>
  );
}

export default WelcomePage;
