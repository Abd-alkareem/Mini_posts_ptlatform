import api from "../api/axiosConfig";

export const postService = {
  // جلب كل المنشورات
  getAllPosts: async (page = 0) => {
    // نرسل البيانات في الـ Body الخاص بالـ POST
    const res = await api.post(`/public/common/get_all_posts.php`, {
      page: page,
    });
    return res.data;
  },

  // جلب حسب الهاشتاج
  getPostsByHash: async (tagName, page = 0) => {
    // console.log("Sending Tag:", tagName); // هل تظهر القيمة هنا فعلاً؟
    const res = await api.post(`public/common/get_posts_by_hash.php`, {
      hash: tagName,
      page: page,
    });
    return res.data;
  },

  // جلب منشورات مستخدم معين (لصفحة البروفايل أو الأدمن)
  getUserPosts: async () => {
    const res = await api.post(`/public/user_api/get_user_posts.php?`, {});
    // console.log(res.data);
    return res.data;
  },
};

// like and dis like funciotn ,we will pass it to Post.jsx
export const changeReact = async (new_react, user_id, post_id) => {
  try {
    const res = await api.post(`/public/user_api/change_react.php`, {
      new_react,
      user_id,
      post_id,
    });
    if (res.data.status !== "success") {
      return false;
    }
    return true; // نجاح
  } catch (error) {
    return false; // فشل في الاتصال بالإنترنت مثلاً
  }
};

// delete the post
export const deletePost = async (post_owner_id, post_id) => {
  try {
    const res = await api.post(`/public/user_api/delete_my_post.php`, {
      post_owner_id,
      post_id,
    });
    if (res.data.status !== "success") {
      return false;
    }
  } catch (error) {
    return false; // فشل في الاتصال بالإنترنت مثلاً
  }
};
