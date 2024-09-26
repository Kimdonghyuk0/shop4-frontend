import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/cart";

export const listCarts = (memberId) =>
  axios.get(REST_API_BASE_URL + "/member/" + memberId);

export const getCart = (cartId) => axios.get(REST_API_BASE_URL + "/" + cartId);

export const createcart = (cart) => axios.post(REST_API_BASE_URL, cart);

export const updateCart = (cartId, cart) =>
  axios.patch(REST_API_BASE_URL + "/" + cartId, cart);

export const deleteCart = (cartId) =>
  axios.delete(REST_API_BASE_URL + "/" + cartId);

export const getCartFromUserAndCart = (memberId, goodsId) =>
  axios.get(REST_API_BASE_URL + "/" + memberId + "/" + goodsId);
