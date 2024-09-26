import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080/api/goods';

export const listGoods = () => axios.get(REST_API_BASE_URL);

export const createGoods = (goods) => axios.post(REST_API_BASE_URL, goods);

export const getGoods = (goodsId) =>
	axios.get(REST_API_BASE_URL + '/' + goodsId);

export const updateGoods = (goodsId, goods) =>
	axios.patch(REST_API_BASE_URL + '/' + goodsId, goods);

export const deleteGoods = (goodsId) =>
	axios.delete(REST_API_BASE_URL + '/' + goodsId);

export const getGoodsByCategory = (category) =>
	axios.get(`${REST_API_BASE_URL}/category/${category}`);
