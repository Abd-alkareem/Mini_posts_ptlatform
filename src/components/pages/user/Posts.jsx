import React, { useEffect, useState, useTransition } from "react";
import "../../css/postsPage.css";
import PostsList from "../main/PostsList";
// icons
import { BsFilePost } from "react-icons/bs";
import { FaHashtag } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
// icons
const buttonsIcons = [
  { icon: BsFilePost, path: "/user/posts/all" },
  { icon: FaHashtag, path: "/user/posts/hash/:tagName" },
  { icon: FaUser, path: "/user/posts/my-posts" },
];
function Posts() {
  // hook for translate
  const { t, i18n } = useTranslation();
  // user info
  const { authedUser } = useAuth();
  // state for manage links
  const [activeLink, setActiveLink] = useState(0);
  // state to count the pages
  const [currentPage, setCurrentPage] = useState(0);

  const location = useLocation();

  // دالة لتحديد أي أيقونة يجب أن تكون نشطة بناءً على المسار
  const getActiveIndex = () => {
    if (location.pathname.includes("/all")) return 0;
    if (location.pathname.includes("/hash")) return 1;
    if (location.pathname.includes("/my-posts")) return 2;
    return 0;
  };

  useEffect(() => {
    setActiveLink(getActiveIndex);
  }, [location]);

  const titles = ["all_posts_title", "hash_posts_title", "my_posts_title"];
  return (
    <div className="posts-page">
      <h1 className="page-title">
        {t(`main_posts_page.${titles[activeLink]}`)}
      </h1>
      <div className="controle">
        {buttonsIcons.map((btn, idx) => {
          return (
            <Link
              to={btn.path}
              key={idx}
              onClick={() => {
                setActiveLink(idx);
              }}
            >
              <btn.icon
                className={`i ${activeLink === idx ? "active" : ""} `}
                id={idx}
              />
            </Link>
          );
        })}
      </div>
      <div className="holder custom-scroll">
        <Routes>
          {/* all posts page */}
          <Route
            path="all"
            element={
              <PostsList type={"all"} page={currentPage} showActions={true} />
            }
          />
          {/* posts by hashtag page */}
          <Route
            path="hash/:tagName"
            element={
              <PostsList type={"hash"} page={currentPage} showActions={true} />
            }
          />
          {/* my posts page */}
          <Route
            path="my-posts"
            element={
              <PostsList
                // user={authedUser.id}
                showActions={true}
                type={"my-posts"}
                page={currentPage}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default Posts;
