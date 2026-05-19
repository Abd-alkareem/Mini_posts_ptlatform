import React, { useEffect, useRef, useState } from "react";
import bgImg from "../../../assets/images/section-3-bg.jpg";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import "../../css/addPostPage.css";
import toast from "react-hot-toast";
import api from "../../../api/axiosConfig"; // axios request obj
// icons
import { FaHashtag } from "react-icons/fa6";
import { BsFilePost } from "react-icons/bs";
import { IoIosWarning } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
// icons
function EditPost() {
  const location = useLocation();
  const postData = location.state; // هنا ستجد البيانات التي أرسلتها
  const postId = postData.id;
  const ownerPostId = postData.ownerId;
  // console.log(ownerPostId);
  // user from context
  const { authedUser, setLoader } = useAuth();
  // hook for translate
  const { t, i18n } = useTranslation();
  // navigatoer obj
  const navigate = useNavigate();
  // state for hash and post
  const [hash, setHash] = useState(postData?.hash || "");
  const [post, setPost] = useState(postData?.content || "");
  // errors
  const [errors, setErrors] = useState({});
  // refreanc for setTimeout to delete it
  const loaderTimerRef = useRef(null);
  // useEffect to clear Timeout
  useEffect(() => {
    return () => {
      // تنظيف أي تايمر شغال عند خروج المستخدم من الصفحة
      if (loaderTimerRef.current) clearTimeout(loaderTimerRef.current);
    };
  }, []);
  // validation rules
  const LINK_REGEX = /(http|https|www\.|\.com|\.net|\.org)/i; // for block links
  const HTML_REGEX = /<[^>]*>/; // for block html tags
  const HASH_FORMAT_REGEX = /^[a-zA-Z]([a-zA-Z0-9]*_?[a-zA-Z0-9]+)*$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tempErrors = {};
    const payload = {
      post,
      hash,
    };

    Object.keys(payload).forEach((field) => {
      const value = payload[field];
      if (LINK_REGEX.test(value)) {
        tempErrors[field] = "no_links_allowed";
      }
      if (HTML_REGEX.test(value)) {
        tempErrors[field] = "no_html_allowed";
      }
      // empty check
      if (!value.trim()) {
        tempErrors[field] = "required_field";
      }
      // check for hash
      if (hash.trim() && !HASH_FORMAT_REGEX.test(hash)) {
        tempErrors["hash"] = "invalid_hash_format";
      }
    });
    setErrors(tempErrors);

    if (Object.keys(tempErrors).length > 0) {
      return null;
    }

    if (Object.keys(tempErrors).length === 0) {
      // start request
      setLoader(true);
      try {
        const response = await api.post("/public/user_api/edit_post.php", {
          post_id: postId,
          owner_id: ownerPostId,
          hash: hash,
          post_text: post,
        });
        if (response) {
          // console.log(response);
          toast.success(t(`edit_post_page.post_updated`));
          setHash("");
          setPost("");
        }
      } catch (error) {
        console.error(error);
        toast.error(t(`edit_post_page.update_errore`));
      } finally {
        loaderTimerRef.current = setTimeout(() => {
          setLoader(false);
        }, 1500);
        navigate("/user/posts/all");
      }
    }
  };
  return (
    <div className="add_post-page">
      <img src={bgImg} className="bg-image" alt="" />
      <span className="page-title">{t(`edit_post_page.page_title`)}</span>
      <div className="form-div">
        <span className="title">{t(`edit_post_page.form_title`)}</span>
        <p>{t(`edit_post_page.form_paragraph`)}</p>
        <form
          action=""
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div className="in-field">
            <span className="i-frame">
              <FaHashtag className="i" />
            </span>
            <input
              name="hash"
              autoComplete="off"
              placeholder={` ${t(`add_post_page.hastag_label`)}`}
              value={hash}
              onChange={(e) => {
                setHash(e.target.value);
                // clear the error when we start re writing
                if (errors.hash) {
                  setErrors((prev) => {
                    const newErrs = { ...prev };
                    delete newErrs.hash;
                    return newErrs;
                  });
                }
              }}
              type="text"
              className="in-tag"
            />
          </div>
          {errors["hash"] && (
            <div className="error-message">
              <span>
                <IoIosWarning className="error-icon" />
              </span>
              <span className="error-text">
                {t(`add_post_page.${errors["hash"]}`)}
              </span>
            </div>
          )}
          <div className="in-field">
            <span className="i-frame">
              <BsFilePost className="i" />
            </span>
            <textarea
              name="post"
              autoComplete="off"
              placeholder={` ${t(`add_post_page.post_label`)}`}
              value={post}
              onChange={(e) => {
                setPost(e.target.value);
                // clear the error when we start re writing
                if (errors.post) {
                  setErrors((prev) => {
                    const newErrs = { ...prev };
                    delete newErrs.post;
                    return newErrs;
                  });
                }
              }}
              className="in-tag"
            ></textarea>
          </div>
          {errors["post"] && (
            <div className="error-message">
              <span>
                <IoIosWarning className="error-icon" />
              </span>
              <span className="error-text">
                {t(`add_post_page.${errors["post"]}`)}
              </span>
            </div>
          )}
          <input
            type="submit"
            className="add-btn"
            value={t(`edit_post_page.edit_btn`)}
          />
        </form>
      </div>
    </div>
  );
}

export default EditPost;
