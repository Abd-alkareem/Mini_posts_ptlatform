import React from "react";
import "../../css/servicesPage.css";
import { useTranslation } from "react-i18next"; // translation hook
// icons
import { LiaSlackHash } from "react-icons/lia";
import { FaFileInvoice } from "react-icons/fa";
import { FaBookOpenReader } from "react-icons/fa6";

// icons

const icons = [
  {
    icon: FaBookOpenReader,
  },
  {
    icon: LiaSlackHash,
  },
  {
    icon: FaFileInvoice,
  },
];
function Services() {
  // translation hook
  const { t, i18n } = useTranslation();

  return (
    <div className="services-page">
      <div className="holder custom-scroll">
        {icons.map((service, idx) => {
          return (
            <div
              className="service-card"
              style={{ marginTop: `${(idx + 1) * 40}px` }}
              key={idx}
            >
              <span className="i-frame">
                <service.icon className="i" />
              </span>
              <span className="service-title">
                {t(`services_page_texts.card_${idx + 1}.title`)}
              </span>
              <p className="service-description">
                {t(`services_page_texts.card_${idx + 1}.description`)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Services;
