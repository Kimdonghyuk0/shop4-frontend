import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/memberCoupon";

//유저의 쿠폰 조회
export const getUserCoupons = (memberId) =>
  axios.get(REST_API_BASE_URL + "/" + memberId);

// 유저에게 쿠폰 발급
export const distributeCoupon = (memberId, couponId) =>
  axios.post(REST_API_BASE_URL + "/" + memberId + "/" + couponId);

// 쿠폰 사용
export const requestUseCoupon = (userCouponMapId) =>
  axios.patch(REST_API_BASE_URL + "/" + userCouponMapId);
