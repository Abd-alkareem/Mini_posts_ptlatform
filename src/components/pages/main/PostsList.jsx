import React, { useEffect, useState } from "react";
import "../../css/others/postsList.css";
import { postService } from "../../../Services/postService";
import PostCard from "./Post";
import { ClipLoader } from "react-spinners";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

function PostsList({ type, page, showActions }) {
  // hook for translate
  const { t, i18n } = useTranslation();
  // array of post to display
  const [arrPosts, setArrPosts] = useState([]);
  // mini loader state
  const [miniLoader, setMiniLoader] = useState(false);
  // get the hash from link
  const { tagName: urlTag } = useParams();
  const [tagName, setTagName] = useState(urlTag || "");
  // 3. تحديث الـ State إذا تغير الرابط (مثلاً ضغطت على هاشتاج جديد وأنت في نفس الصفحة)
  useEffect(() => {
    if (urlTag) {
      setTagName(urlTag);
    }
  }, [urlTag]);
  // first effect to call the function depending on type
  useEffect(() => {
    // console.log("console from useEffect", type);
    const loadData = async () => {
      setMiniLoader(true);
      let data;
      // هنا تظهر المرونة.. استدعاء التابع المناسب
      if (type === "all") data = await postService.getAllPosts(page);
      if (
        type === "hash" &&
        typeof tagName === "string" &&
        tagName.trim() !== ""
      )
        data = await postService.getPostsByHash(tagName);
      if (type === "my-posts") data = await postService.getUserPosts();

      // console.log(data);
      if (data) {
        setArrPosts(data.list);
      } else {
        setArrPosts([]);
      }
      setMiniLoader(false);
    };

    loadData();
  }, [type, page, tagName]);
  return (
    <div
      className="posts-list "
      style={{ position: "relative", height: "100%" }}
    >
      {/* search field only in hash page */}
      {type === "hash" && (
        <div className="search-field">
          <input
            type="text"
            value={tagName === ":tagName" ? "" : tagName}
            placeholder={t(`main_posts_page.search_field_label`)}
            onChange={(e) => setTagName(e.target.value)}
          />
        </div>
      )}
      {/* in case loader is on */}
      {miniLoader ? (
        <>
          <div className="loader-div">
            <ClipLoader color="#314755" size={40} />
          </div>
        </>
      ) : (
        <>
          {arrPosts.length === 0 ? (
            <>
              {/* in case there is no posts */}
              <p className="no-posts-p">
                {t(`main_posts_page.no_posts_message`)}
              </p>
            </>
          ) : (
            <>
              {/* in case there is posts */}
              {arrPosts.map((post, idx) => {
                return (
                  <PostCard
                    posts={arrPosts}
                    setPosts={setArrPosts}
                    setloader={setMiniLoader}
                    data={post}
                    key={idx}
                    showActions={showActions}
                  />
                );
              })}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default PostsList;
