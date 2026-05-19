import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/user/HomePage";
import Services from "../pages/user/Services";
import ContactUs from "../pages/user/ContactUs";
import AddPostPage from "../pages/user/AddPostPage";
import Posts from "../pages/user/Posts";
import EditPost from "../pages/user/EditPost";

function UserLayout() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="services" element={<Services />} />
        <Route path="contact-us" element={<ContactUs />} />
        <Route path="add-post" element={<AddPostPage />} />
        <Route path="edit-post" element={<EditPost />} />
        <Route path="posts/*" element={<Posts />} />
      </Routes>
    </div>
  );
}

export default UserLayout;
