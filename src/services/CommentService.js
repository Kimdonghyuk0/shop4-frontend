import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/comment";

export const listComments = (goodsId) =>
  axios.get(REST_API_BASE_URL + "/goods/" + goodsId);

export const getComment = (commentId) =>
  axios.get(REST_API_BASE_URL + "/" + commentId);

export const createComment = (comment) =>
  axios.post(REST_API_BASE_URL, comment);

export const updateComment = (commentId, comment) =>
  axios.patch(REST_API_BASE_URL + "/" + commentId, comment);

export const deleteComment = (commentId) =>
  axios.delete(REST_API_BASE_URL + "/" + commentId);

export const postLike = (commentId, memeberId) =>
  axios.post(REST_API_BASE_URL + "/like/" + commentId + "/" + memeberId);

export const getLike = (commentId, memeberId) =>
  axios.get(REST_API_BASE_URL + "/like/" + commentId + "/" + memeberId);

export const canComment = (memberId, goodsId) =>
  axios.get(REST_API_BASE_URL + "/can-comment/" + memberId + "/" + goodsId);
