import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080/api/chatSystem';

//채팅 목록 리스트
export const getChatList = (id) =>
  axios.get(REST_API_BASE_URL + '/getChatList/' + id);

// 채팅방 들어갈때마다 항상 실행돼야함
export const setLastRead = (user_chatRoom_id) =>
  axios.get(REST_API_BASE_URL + '/setLastRead/' + user_chatRoom_id);

//메세지들이 날짜기준 오름차순으로 정렬된 json으로 온다.
export const getMessageList = (user_chatRoom_id) =>
  axios.get(REST_API_BASE_URL + '/getMessageList/' + user_chatRoom_id);

//고유 채팅방 id조회 대화방 처음만들때 호출해야됨 (setLastRead랑 같이)
export const getChatRoomNum = (userIdA, userIdB) =>
  axios.get(REST_API_BASE_URL + '/getChatRoomNum/' + userIdA + '/' + userIdB);

//메시지 전송기능
export const sendMessage = (message) => axios.post(REST_API_BASE_URL, message);

// 쪽지기능 api

// #######################채팅방 목록 불러오기 - GET방식

// http://localhost:8080/api/chatSystem/getChatList/{userId} 고유 아이디임 Long타입

// 예시 리턴값

// [
// {
// "id": 1,
// "member":{"id": 1, "name": "김동혁", "email": "ㅇㅁㄴ@gmail.com", "address": null,…},
// "chatRoom":{"id": 1, "users":[{"id": 1, "name": "김동혁",…},
// "myLastReadMessageId": null,
// "friendLastReadMessageId": null,
// "friendId": "ujkid",
// "friendName": "유정균",
// "hide": false,
// "countMessage": 0
// },
// {
// "id": 3,
// "member":{"id": 1, "name": "김동혁", "email": "ㅇㅁㄴ@gmail.com", "address": null,…},
// "chatRoom":{"id": 2, "users":[{"id": 1, "name": "김동혁", "email": "ㅇㅁㄴ@gmail.com",…},
// "myLastReadMessageId": null,
// "friendLastReadMessageId": null,
// "friendId": "kim1",
// "friendName": "동혁이",
// "hide": false,
// "countMessage": 0
// }
// ]

// 이렇게 채팅방 목록이 오게된다.

// ####################### myLastReadMessageId,friendLastReadMessageId 값을 최신화 시켜주는 api 해당 채팅방 처음 들어갈때만 호출한다. 읽음 안읽음 최신화라고 보면 된다. GET방식
// http://localhost:8080/api/chatSystem/setLastRead/{user_chatRoom_id}
// 하면 자동으로 myLastReadMessageId가 상대가 가장 마지막에 보낸 메세지로 초기화 된다.  이걸로 상대가 읽었는지 안읽었는지 알 수 있다.
// 메세지 없으면 0으로 초기화 된다.

// #######################메세지 불러오기(user_chat_room_id별로) -GET방식
// http://localhost:8080/api/chatSystem/getMessageList/{user_chatRoom_id}
// 메세지들이 날짜기준 오름차순으로 정렬된 json으로 온다.

// #######################고유 채팅방 id조회  - Get방식
// http://localhost:8080/api/chatSystem/getChatRoomNum/{userIdA}/{userIdB} 고유 아이디임 Long타입

// url에 둘의 고유 아이디를 보내면 둘의 고유 채팅방 id와 "userChatRoomId": 두개를 return한다.

// 예시 리턴값

// {
// "userBChatRoomId": 20,
// "chatRoomId": 12,
// "userAChatRoomId": 19
// }

// #######################메세지 전송기능 - Post 방식

// http://localhost:8080/api/chatSystem
// chatRoomId는 위 고유 채팅방 id조회에서 받은 id를 사용해야한다.
// 아래와 같이 json형태로 보낸다.

// {
//   "chatRoom": 1,
//   "sender": 2,  //메세지를 보낸사람 고유 ID
//   "content": "안녕하세요!",
//   "senderUserChatRoomId": 3,
//   "recipientUserChatRoomId": 4
// }

// 참고로  "senderUserChatRoomId": 3,        // 본인의 userChatRoomId
//   "recipientUserChatRoomId": 4,     // 상대방의 userChatRoomId
//  얘네 순서는 안중요함 같은 데이터 들어가는거라
// 만약 실시간 채팅이면 중요함! 전송 시각이 ms기준으로 보면 달라서
