import React, { useState } from "react";
import "../../css/contactPage.css";
import { useTranslation } from "react-i18next";
// icons
import { FaUser } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// icons

const contactForm = [
  {
    name: "name",
    type: "text",
    placeholder: "name_label",
    icon: FaUser,
  },
  {
    name: "email",
    type: "email",
    placeholder: "email_label",
    icon: MdAlternateEmail,
  },
  {
    name: "subject",
    type: "text",
    placeholder: "subject_label",
    icon: FaPen,
  },
  {
    name: "message",
    type: "text",
    placeholder: "message_label",
    icon: FaMessage,
  },
];
const social = [
  {
    platform_name: "instagram",
    icon: FaInstagram,
    link: "",
    label: "",
  },
  {
    platform_name: "Gmail",
    icon: SiGmail,
    link: "/",
    label: "",
  },
  {
    platform_name: "Linked In",
    icon: FaLinkedin,
    link: "",
    label: "",
  },
];

// submit for contact form

function ContactUs() {
  // hook for translate
  const { t, i18n } = useTranslation();
  const handleSubmit = async (e) => {
    e.preventDefault(); // منع المتصفح من إعادة تحميل الصفحة

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      subject: e.target.subject.value,
      message: e.target.message.value,
      // لإلغاء الكابتشا في نظام الـ AJAX نرسلها داخل الـ body
      _captcha: "false",
    };
    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/ff85debfb3fac2a746177ca20deba839",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // ضروري جداً!
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        },
      );
      if (response.status === 200) {
        toast.success(t("contact_page.email_sent_seccfullt")); // إظهار التواست
        e.target.reset(); // تصفير الحقول
      } else {
        toast.error(t("contact_page.can't_send_email"));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="contact-us">
      <h1 className="page-title">{`- ${t(`contact_page.page_title`)} :`}</h1>
      <div className="holder custom-scroll">
        <div className="part form-div">
          <h1 className="form-title">{`- ${t(`contact_page.form_title`)} :`}</h1>
          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            {/* with this filed we dont go to the confirming page after send */}
            <input
              type="hidden"
              name="_next"
              value="https://your-domain.com/thanks"
            />
            <input type="hidden" name="_captcha" value="false" />
            {contactForm.map((field, idx) => {
              return (
                <div className="in-field" key={idx}>
                  <span>
                    <field.icon className="i" />
                  </span>
                  {field.name === "message" ? (
                    <textarea
                      className="in-tag"
                      required
                      name={field.name}
                      placeholder={` ${t(
                        `contact_page.form_fields.${field.placeholder}`,
                      )}...`}
                    ></textarea>
                  ) : (
                    <input
                      className="in-tag"
                      type={field.type}
                      name={field.name}
                      required
                      placeholder={` ${t(
                        `contact_page.form_fields.${field.placeholder}`,
                      )}...`}
                      autoComplete="off"
                    />
                  )}
                </div>
              );
            })}
            <input
              type="submit"
              className="send-email-btn"
              value={t(`contact_page.form_fields.send_btn`)}
            />
          </form>
        </div>
        <div className="part contact-info">
          <p className="social-title">{`${t(`contact_page.social_title`)}`}</p>
          <div className="mini-holder">
            {social.map((ele, idx) => {
              return (
                <Link
                  onClick={(e) => {
                    if (ele.platform_name === "Gmail") {
                      e.preventDefault(); // منع الانتقال للرابط "/"
                      navigator.clipboard.writeText("your.email@gmail.com"); // آلية الحفظ (نسخ للإيميل)
                      toast.success(t("contact_page.email_copied"), {
                        position: "bottom-left",
                      });
                    }
                  }}
                  target={ele.link !== "" ? "_blank" : ""}
                  key={idx}
                  to={ele.link}
                  className="social-div"
                >
                  <span>
                    <ele.icon className="i" />
                  </span>
                  <p>{ele.platform_name}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
