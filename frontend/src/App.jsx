import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { DashboardLayout } from "./components";
import PostBlogForm from "./components/forms/PostBlogForm";
import {
  Blog,
  CollectorTable,
  Home,
  LoginForm,
  RegistrationForm,
  Subscription,
  UserSubscriptionList,
} from "./pages";
import BlogDescription from "./pages/Blog/BlogDescription";
import BlogsLists from "./pages/Blog/BlogsLists";
import CollectorFeedbacksList from "./pages/Collector/CollectorFeedbackList";
import CollectorRegularPickupsList from "./pages/Collector/PickupSchedules/CollectorRegularPickupsList";
import CollectorUrgentPickupList from "./pages/Collector/PickupSchedules/CollectorUrgentPickupList";
import Cart from "./pages/Marketplace/Cart";

import ProductList from "./pages/Marketplace/Product/component/ProductList";
import SingleProduct from "./pages/Marketplace/Product/component/SingleProduct";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UserFeedbacksList from "./pages/User/UserFeedbacksList";
import RegularPickupSchedules from "./pages/User/WastePickups/RegularPickupSchedules";
import UrgentPickupSchedules from "./pages/User/WastePickups/UrgentPickupSchedules";
import UserProfilePage from "./pages/UserProfilePage";
import Addproduct from "./pages/Addproduct";
import UserOrderList from "./pages/User/UserOrderList";
import AdminOrderList from "./pages/AdminOrdersList";
import ProtectRoutes from "./components/protect-routes/ProtectRoutes";
import AuthorizeRoutes from "./components/protect-routes/AuthorizeRoutes";
import PageNotFound from "./pages/PageNotFound";

function App() {
  useEffect(() => {
    // Add your script here
    var Tawk_API = Tawk_API || {};
    var Tawk_LoadStart = new Date();
    (function () {
      var s1 = document.createElement("script"),
        s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = "https://embed.tawk.to/65e157138d261e1b5f6720d2/1hns3o9kf";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      s0.parentNode.insertBefore(s1, s0);
    })();
  }, []); // Empty dependency array ensures that the effect runs only once after the initial render

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/blogs/:blogID" element={<BlogDescription />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/registration" element={<RegistrationForm />} />
          <Route path="/singleproduct/:productID" element={<SingleProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product" element={<ProductList />} />

          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route element={<ProtectRoutes />}>
            <Route element={<AuthorizeRoutes role={"user"} />}>
              {/* User Dashboard Links */}
              <Route path="/user/dashboard" element={<DashboardLayout />}>
                <Route index element={<UserSubscriptionList />} />

                <Route path="blog" element={<BlogsLists />} />
                <Route path="post-blog" element={<PostBlogForm />} />
                <Route
                  path="regular-schedules"
                  element={<RegularPickupSchedules />}
                />
                <Route
                  path="urgent-schedules"
                  element={<UrgentPickupSchedules />}
                />

                <Route path="feedbacks" element={<UserFeedbacksList />} />

                <Route path="profile/:userID" element={<UserProfilePage />} />
                <Route path="orders" element={<UserOrderList />} />
              </Route>
            </Route>

            <Route element={<AuthorizeRoutes role={"admin"} />}>
              {/* Admin Dashboard Links */}
              <Route path="/admin/dashboard" element={<DashboardLayout />}>
                <Route index element={<CollectorTable />} />
                <Route path="blog" element={<BlogsLists />} />
                <Route path="post-blog" element={<PostBlogForm />} />
                <Route path="post-blog" element={<PostBlogForm />} />
                <Route path="addproduct" element={<Addproduct />} />
                <Route path="orders" element={<AdminOrderList />} />
              </Route>
            </Route>

            <Route element={<AuthorizeRoutes role={"collector"} />}>
              {/* Collector Dashboard Links */}
              <Route path="/collector/dashboard" element={<DashboardLayout />}>
                <Route index element={<CollectorRegularPickupsList />} />

                <Route path="blog" element={<BlogsLists />} />

                <Route
                  path="urgent-schedules"
                  element={<CollectorUrgentPickupList />}
                />

                <Route path="feedbacks" element={<CollectorFeedbacksList />} />
                <Route path="profile/:userID" element={<UserProfilePage />} />
              </Route>
            </Route>
          </Route>

          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
