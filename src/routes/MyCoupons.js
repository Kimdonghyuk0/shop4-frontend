import MyPageLeftSideBar from "../components/MyPageLeftSideBar";
import React, { useState, useEffect } from "react";
import styles from "./css/MyCoupons.module.css";
import { getUserCoupons } from "../services/UserCouponService";
function MyCoupons() {
  const userSession = JSON.parse(sessionStorage.getItem("user")); // 세션에서 사용자 이름 가져오기

  const [activeTab, setActiveTab] = useState("available"); // 활성 탭 상태
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [usedCoupons, setUsedCoupons] = useState([]); // 객체 배열

  useEffect(() => {
    const fetchCoupons = async () => {
      const res = await getUserCoupons(userSession.id);
      let getCoupons = res.data;
      // 사용된 쿠폰과 사용 가능한 쿠폰 분리
      const usedCoupons = getCoupons.filter(
        (coupon) => coupon.usedCoupon === true
      );
      const availableCoupons = getCoupons.filter(
        (coupon) => coupon.usedCoupon === false
      );

      // 상태 업데이트
      setUsedCoupons(usedCoupons);
      setAvailableCoupons(availableCoupons);
    };
    fetchCoupons();
  }, [userSession.id]);

  const handleToggle = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className={styles.myPageContainer}>
        <MyPageLeftSideBar />
        <div className={styles.rightContent}>
          <h2>쿠폰함</h2>
          <hr />
          <div className={styles.couponTabs}>
            <button
              onClick={() => handleToggle("available")}
              className={activeTab === "available" ? "active" : ""}
            >
              사용 가능{availableCoupons.length}개
            </button>
            <button
              onClick={() => handleToggle("used")}
              className={activeTab === "used" ? "active" : ""}
            >
              사용 완료{usedCoupons.length}개
            </button>
          </div>
          <ul className={styles.couponList}>
            {activeTab === "available"
              ? availableCoupons.map((coupon, idx) => (
                  <li key={idx}>{coupon.coupons.name}</li> // 고유한 id 사용
                ))
              : usedCoupons.map((coupon, idx) => (
                  <li key={idx}>{coupon.coupons.name}</li> // 고유한 id 사용
                ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default MyCoupons;
