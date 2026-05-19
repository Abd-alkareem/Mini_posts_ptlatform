import React, { useState } from "react";
import aImg from "../../assets/images/menu-item-bg.png"; // الصورة المستخدمة في البار
// أيقونات
import { FaHome, FaPencilAlt, FaUser } from "react-icons/fa";
import { GiArchiveRegister } from "react-icons/gi";
import { PiSlideshowFill } from "react-icons/pi";
import { FaBarsProgress } from "react-icons/fa6";
import { HiMiniBars4 } from "react-icons/hi2";
import { LuMessageCircleMore } from "react-icons/lu";

//
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // hook for i18n to trans the texts
import "../css/sidebar.css"; // css
import { useAuth } from "../context/AuthContext"; // hook for context

function Sidebar() {
  // user from context
  const { authedUser } = useAuth();
  // hook for translate
  const { t, i18n } = useTranslation();
  // تحديد اتجاه النص بناءً على اللغة الحالية
  const isRtl = i18n.language === "ar";

  // side bar links
  const menuItems = [
    { key: "home", icon: FaHome, path: "/" },
    { key: "what_we_do", icon: GiArchiveRegister, path: "/user/services" },
    { key: "posts", icon: PiSlideshowFill, path: "/user/posts/all" },
    { key: "add_post", icon: FaPencilAlt, path: "/user/add-post" },
    // { key: "profile", icon: FaBarsProgress, path: "/" },
  ];
  // manege the active link
  const [activeLink, setActiveLink] = useState(0);
  // open close sidebar
  const [activeSidebar, setActiveSidebar] = useState(false);
  return (
    <div className={`sidebar ${activeSidebar ? "active" : ""}`}>
      <ul className="links">
        {menuItems.map((item, i) => (
          <li key={i}>
            <Link
              className={`a ${i === activeLink ? "active" : ""}`}
              to={item.path}
              onClick={(e) => {
                setActiveLink(i);
                setActiveSidebar(false);
              }}
            >
              <img src={aImg} alt="" />
              <div className="">
                <item.icon className="i" />
                <span>{t(`sidebar.${item.key}`)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <HiMiniBars4
        className={`menu-btn ${activeSidebar ? "active" : ""}`}
        onClick={() => {
          setActiveSidebar(!activeSidebar);
        }}
      />
      <div className="bottom-div">
        {/* the name tag which must take us to account info page */}
        <span
          to="/"
          className="account-div"
          onClick={() => {
            setActiveSidebar(false);
          }}
        >
          <div className="img-frame">
            <FaUser className="i" />
          </div>
          <span className="name">{authedUser.full_name}</span>
        </span>
        <div className="contact-us">
          <Link
            to="/user/contact-us"
            className="contact-link"
            onClick={() => {
              setActiveLink(null);
              setActiveSidebar(false);
            }}
          >
            <LuMessageCircleMore className="contact-i" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
