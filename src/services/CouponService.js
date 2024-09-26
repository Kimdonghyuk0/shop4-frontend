import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/coupons";

export const listCoupons = () => axios.get(REST_API_BASE_URL);

export const createCoupons = (coupon) => axios.post(REST_API_BASE_URL, coupon);

export const deleteCoupon = (couponId) =>
  axios.delete(REST_API_BASE_URL + "/" + couponId);
