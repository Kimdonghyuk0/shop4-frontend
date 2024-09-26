import AdminMenu from "./AdminMenu.js";
import AdminHome from "./AdminHome.js";
import { Route, Routes } from "react-router-dom";
import MemberManagement from "./MemberManagement.js";
import GoodsManagement from "./GoodsManagement.js";
import AddGoods from "./AddGoods.js";
import Reports from "./Reports.js";
import { useEffect } from "react";
import UpdateGoods from "./UpdateGoods.js";
import CouponManagement from "./CouponManagement.js";

function Admin() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        margin: "0 auto",
        display: "flex",
      }}
    >
      <AdminMenu></AdminMenu>
      <div
        style={{
          width: "85%",
          backgroundColor: "#E6E6E6",
        }}
      >
        <Routes>
          <Route path="/" element={<AdminHome />}></Route>
          <Route
            path="/members"
            element={<MemberManagement></MemberManagement>}
          ></Route>
          <Route
            path="/goods"
            element={<GoodsManagement></GoodsManagement>}
          ></Route>
          <Route path="/addgoods" element={<AddGoods></AddGoods>}></Route>
          <Route path="/reports" element={<Reports></Reports>}></Route>
          <Route
            path="/updategoods"
            element={<UpdateGoods></UpdateGoods>}
          ></Route>
          <Route
            path="/couponManagement"
            element={<CouponManagement />}
          ></Route>
        </Routes>
      </div>
    </div>
  );
}

export default Admin;
