import React, { useState } from "react";
import styles from "./admincss/AddCoupon.module.css"; // 스타일 파일 추가
import { createCoupons } from "../../services/CouponService";
import { useNavigate } from "react-router-dom";

const CouponManagement = () => {
  let navigate = useNavigate();

  const [couponData, setCouponData] = useState({
    name: "",
    discount: "",
    createDate: "",
    limitDate: "",
    count: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData({ ...couponData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 쿠폰 등록 로직 작성
    await createCoupons(couponData);
    console.log(couponData);
    alert("성공적으로 등록되었습니다.");
    navigate("/admin");
  };

  return (
    <div className={styles.couponFormContainer}>
      <h2 className={styles.couponFormTitle}>Add a New Coupon</h2>
      <form className={styles.CouponForm} onSubmit={handleSubmit}>
        <div className={styles.inputContainer}>
          <label htmlFor="name">Coupon Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={couponData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="discount">Discount Amount:</label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={couponData.discount}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="createDate">Creation Date:</label>
          <input
            type="date"
            id="createDate"
            name="createDate"
            value={couponData.createDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="limitDate">Expiration Date:</label>
          <input
            type="date"
            id="limitDate"
            name="limitDate"
            value={couponData.limitDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="count">Available Count:</label>
          <input
            type="number"
            id="count"
            name="count"
            value={couponData.count}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Add Coupon
        </button>
      </form>
    </div>
  );
};

export default CouponManagement;
