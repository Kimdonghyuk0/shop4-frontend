// ChatListTable.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChatList } from '../services/ChatService';
import defaultImage from '../../src/images/default.jpg';
import { FaComments } from 'react-icons/fa';
import './css/ChatList.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getMember } from '../services/MemberService';

const getCurrentUserId = () => {
  const user = sessionStorage.getItem('user');
  return JSON.parse(user)?.id;
};

const ChatListTable = () => {
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // useNavigate 훅 사용

  const fetchChatList = async () => {
    const memberId = getCurrentUserId();

    if (!memberId) {
      setError('사용자 ID를 찾을 수 없습니다.');
      setLoading(false);
      return;
    }

    try {
      const response = await getChatList(memberId); // 채팅 목록 가져오기
      const chatListData = response.data;

      // 각 채팅방에 대해 상대방의 이미지를 가져옴
      const chatListWithImages = await Promise.all(
        chatListData.map(async (chat) => {
          // 상대방의 memberId를 가져와야 함
          // chat.friendId를 통해 상대방의 userId를 알고 있으므로, 이를 이용해 memberId를 가져와야 함
          // 여기서는 서버에서 chat.friendMemberId를 반환한다고 가정

          // 만약 chat에 friendMemberId가 없으면, 추가로 API를 통해 가져와야 함
          const memberResponse = await getMember(chat.friendId);
          const friendData = memberResponse.data;

          const imageUrl =
            friendData.userImage && friendData.userImage.length > 0
              ? `data:image/jpeg;base64,${friendData.userImage}`
              : defaultImage;

          return {
            ...chat,
            friendImageUrl: imageUrl,
          };
        })
      );

      setChatList(chatListWithImages);
      setLoading(false);
    } catch (error) {
      setError('채팅 목록을 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatList();
  }, []);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // 채팅방 클릭 핸들러
  const handleChatRoomClick = (userChatRoomId, friendId) => {
    // 상대방의 userId를 URL 파라미터로 전달
    navigate(`/chatRoom/${userChatRoomId}/${friendId}`);
  };

  return (
    <div className="chatListContainer">
      <br />
      <h2
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          fontWeight: 'bold',
          fontSize: '35px',
        }}
      >
        <FaComments style={{ fontSize: '50px', marginRight: '10px' }} /> 채팅
        목록
      </h2>

      <table className="chatListTable">
        <tbody>
          {chatList.length > 0 ? (
            chatList.map((chat) => (
              <tr
                key={chat.id}
                onClick={() => handleChatRoomClick(chat.id, chat.friendId)}
                style={{ cursor: 'pointer' }}
              >
                <td colSpan="2">
                  <div className="chatRow">
                    <div className="chatItem">
                      <button className="btn image-btn">
                        <img
                          src={chat.friendImageUrl}
                          alt="Profile"
                          className="profile-img"
                          style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '100%',
                            transition:
                              'transform 0.3s ease, box-shadow 0.3s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow =
                              '0 4px 10px rgba(0, 0, 0, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        />
                      </button>
                      &nbsp;&nbsp; &nbsp;&nbsp;
                      {`${chat.friendName}님과의 대화방`}
                      {chat.countMessage > 0 && (
                        <span
                          className="badge bg-danger text-white rounded-circle"
                          style={{
                            marginLeft: '10px',
                            minWidth: '25px',
                            height: '25px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                          }}
                        >
                          {chat.countMessage}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ fontWeight: 'bold', fontSize: '20px' }}>
                <br />
                채팅방이 없습니다.
                <br />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ChatListTable;
