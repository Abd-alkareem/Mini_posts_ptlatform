import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"; // لتفعيل روابط الهاشتاج
import avImg from "../../../assets/images/default_avatar.png";
//  icons
import {
  FaGlobeAmericas,
  FaEllipsisH,
  FaHeart,
  FaCopy,
  FaShare,
  FaEllipsisV,
  FaEdit,
  FaTrash,
} from "react-icons/fa"; // أيقونات مقترحة
import { IoHeartDislike } from "react-icons/io5";
// icons
import "../../css/others/post.css"; // تأكد من إنشاء هذا الملف
import toast from "react-hot-toast"; // toast obj
import { changeReact, deletePost } from "../../../Services/postService"; // function to change react
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

function PostCard({ data, showActions, posts, setPosts, setloader }) {
  // hook for translate
  const { t, i18n } = useTranslation();
  // user info
  const { authedUser } = useAuth();
  // state to manage reaction
  const [react, setReact] = useState(data.user_interaction);
  // funcion to handle change react
  const handleChangeReact = async (newReact) => {
    // 1. حفظ الحالة الحالية (للرجوع إليها عند الخطأ)
    const previousReact = react;

    // 2. حساب القيمة القادمة
    const nextValue = newReact === null ? -1 : newReact;

    // 3. تحديث الـ State فوراً (Optimistic Update)
    setReact(newReact);
    // console.log("new react after set in func", newReact);
    // 4. إرسال الطلب وانتظار النتيجة
    const isSuccess = await changeReact(nextValue, authedUser.id, data.id);
    // console.log("response ", isSuccess);
    // 5. إذا فشلت العملية، تراجع عن التغيير في الواجهة
    if (!isSuccess) {
      console.error("فشلت عملية التفاعل، جاري التراجع...");
      setReact(previousReact);
    }
  };

  // state to manage option menu open/close
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  // إغلاق القائمة عند الضغط في أي مكان خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // حالة التحكم في عرض النص الكامل أم المقصوص
  const [showFullText, setShowFullText] = useState(false);

  // الحد الأقصى للحروف قبل قص النص (مثلاً 250 حرف)
  const TEXT_LIMIT = 250;

  // تحديد هل النص أصلاً أطول من الحد المسموح؟
  const isLongText = data.post_content.length > TEXT_LIMIT;

  // دالة لتجهيز النص للعرض (مقصوص أو كامل)
  const renderContent = () => {
    if (showFullText || !isLongText) {
      return data.post_content; // عرض النص كاملاً
    }
    // عرض أول 250 حرف مع نقاط
    return data.post_content.substring(0, TEXT_LIMIT) + "...";
  };

  return (
    <div className="post-card">
      {/* --- الهيدر: الصورة، الاسم، المستخدم، التاريخ --- */}
      <div className="post-header">
        <div className="post-meta">
          <img
            // src={data.user_avatar || "/assets/images/default_avatar.png"} // صورة افتراضية في حال لم توجد
            src={avImg} // صورة افتراضية في حال لم توجد
            alt={data.user_full_name}
            className="user-avatar"
          />
          <div className="name-time">
            <div className="user-names">
              <h3 className="full-name">{data.user_full_name}</h3>
              <span className="user-name">@{data.user_name}</span>
            </div>
            <div className="time-location">
              {/* تنسيق التاريخ مستقبلاً بـ timeago.js */}
              <span className="post-date">{data.created_at}</span>
              <span className="separator">•</span>
              <FaGlobeAmericas className="privacy-icon" title="عام" />
            </div>
          </div>
        </div>
        {/* options  */}
        {data.user_id === authedUser.id && (
          <div className="post-options" ref={menuRef}>
            <button
              className="menu-trigger"
              onClick={() => setShowMenu(!showMenu)}
            >
              <FaEllipsisV />
            </button>

            {showMenu && (
              <ul className="dropdown-menu">
                <li
                  onClick={() => {
                    /* نادِ تابع التعديل هنا */ setShowMenu(false);
                  }}
                >
                  <Link
                    state={{
                      id: data.id,
                      ownerId: data.user_id,
                      content: data.post_content,
                      hash: data.hashtag,
                    }}
                    to={`/user/edit-post`}
                  >
                    <FaEdit /> {t(`main_posts_page.edit_post_btn`)}
                  </Link>
                </li>
                <li
                  className="delete-opt"
                  onClick={() => {
                    /* نادِ تابع الحذف هنا */ setShowMenu(false);
                    Swal.fire({
                      title: `${t(`main_posts_page.first_m_in_delete_box`)}`,
                      text: `${t(`main_posts_page.secound_m_in_delete_box`)}`,
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#d33",
                      cancelButtonColor: "#26a0da",
                      confirmButtonText: `${t(`main_posts_page.confirm_delete_btn`)}`,
                      cancelButtonText: `${t(`main_posts_page.cancle_delete_btn`)}`,
                    }).then((result) => {
                      if (result.isConfirmed) {
                        setloader(true);
                        const finalRes = deletePost(data.user_id, data.id);
                        if (finalRes) {
                          setPosts((prev) => {
                            return posts.filter((ele) => {
                              return ele.id !== data.id;
                            });
                          });
                          Swal.fire({
                            title: `${t(`main_posts_page.deleted_done_title`)}`,
                            text: `${t(`main_posts_page.deleted_done_p`)}`,
                            icon: "success",
                          });
                          setloader(false);
                        } else {
                          toast.error("delete error");
                        }
                      }
                    });
                  }}
                >
                  <FaTrash /> {t(`main_posts_page.delete_post_btn`)}{" "}
                </li>
              </ul>
            )}
          </div>
        )}
      </div>

      {/* --- منطقة المحتوى (النص وزر المزيد) --- */}
      <div className="post-body">
        <p className="post-content">
          {renderContent()}
          {isLongText && !showFullText && (
            <button
              className="show-more-btn"
              onClick={() => setShowFullText(true)}
            >
              {t(`main_posts_page.show_more`)}
            </button>
          )}
        </p>

        {/* الهاشتاج كـ Link يأخذك لصفحة الهاشتاج */}
        {data.hashtag && (
          <Link
            onClick={() => {}}
            to={`/user/posts/hash/${data.hashtag}`}
            className="hash-link"
          >
            #{data.hashtag}
          </Link>
        )}
      </div>

      {/* --- منطقة التفاعل (Like, Comment, Share) --- */}
      {showActions && (
        <div className="post-actions">
          <button
            className={`action-btn ${react === 1 ? "liked" : ""}`}
            onClick={() => handleChangeReact(react === 1 ? null : 1)}
          >
            <FaHeart /> {t(`main_posts_page.like_btn`)}
          </button>
          <button
            className={`action-btn ${react === 0 ? "desliked" : ""}`}
            onClick={() => handleChangeReact(react === 0 ? null : 0)}
          >
            <IoHeartDislike /> {t(`main_posts_page.unLike_btn`)}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault(); // منع الانتقال للرابط "/"
              navigator.clipboard.writeText(""); // آلية الحفظ (نسخ للإيميل)
              toast.success(`${t(`main_posts_page.copy_toast_text`)}`, {
                position: "bottom-left",
              });
            }}
            className="action-btn"
          >
            <FaCopy /> {t(`main_posts_page.copy_btn`)}
          </button>
        </div>
      )}
    </div>
  );
}

export default PostCard;
