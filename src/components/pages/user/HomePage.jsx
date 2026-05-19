import React from "react";
import bgImage from "../../../assets/images/section-1-bg.jpg";
import "../../css/homePage.css";
// icons
import { FaFacebookF } from "react-icons/fa";
// icons
// hook for i18n to trans the texts
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
function HomePage() {
  const { t, i18n } = useTranslation();

  return (
    <div className="home-page">
      <img src={bgImage} alt="" className="bg-image" />
      <div className="main-card">
        <span>
          <FaFacebookF className="website-i" />
        </span>
        <p className="main-p-home">{t(`home_page_texts.main-card-text`)}</p>
      </div>
      <p className="secound-card">
        {t(`home_page_texts.secound_card_text`)} <br />
        <Link className="a" to={"/user/contact-us"}>
          {t(`home_page_texts.link_in_secound_card`)}
        </Link>
      </p>
    </div>
  );
}

export default HomePage;
