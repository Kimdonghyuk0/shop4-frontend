import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080/api/members';

export const listMembers = () => axios.get(REST_API_BASE_URL);

export const createMember = (member) => axios.post(REST_API_BASE_URL, member);

export const getMember = (memberId) =>
  axios.get(REST_API_BASE_URL + '/' + memberId);

export const getMemberByUserId = (memberId) =>
  axios.get(REST_API_BASE_URL + '/userId/' + memberId);

export const updateMember = (memberId, member) =>
  axios.patch(REST_API_BASE_URL + '/' + memberId, member);

export const deleteMember = (memberId) =>
  axios.delete(REST_API_BASE_URL + '/' + memberId);

export const updateProfileImage = (memberId, image) =>
  axios.patch(REST_API_BASE_URL + '/updateProfileImage/' + memberId, image);

export const getProfileImage = (memberId) =>
  axios.get(REST_API_BASE_URL + '/getProfileImage/' + memberId, {
    responseType: 'blob',
  });

export const deleteProfileImage = (memberId) =>
  axios.delete(REST_API_BASE_URL + '/deleteProfileImage/' + memberId);
