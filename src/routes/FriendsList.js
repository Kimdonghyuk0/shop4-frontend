import React, { useState, useEffect } from 'react';
import MyPageLeftSideBar from '../components/MyPageLeftSideBar';
import './css/MyPage.css';
import defaultImage from '../../src/images/default.jpg';
import { FaUserFriends } from 'react-icons/fa';
import { TiUserDelete } from 'react-icons/ti';
import { listFriends, deleteFriend } from '../services/FriendService';
import './css/Friends.css';
import { IoPersonAddSharp } from 'react-icons/io5';
import FriendsRequestModal from '../components/Friend/FriendsRequestModal';
import { useNavigate } from 'react-router-dom'; // 추가
import { getChatRoomNum, setLastRead } from '../services/ChatService'; // 추가
import { getMemberByUserId } from '../services/MemberService';
const FriendsList = () => {
  const [friendsData, setFriendsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달창 관리
  const [popupFriendId, setPopupFriendId] = useState(null); // 팝업 관리
  const user = sessionStorage.getItem('user');
  const memberId = JSON.parse(user)?.id; // 현재 로그인된 사용자 ID
  const navigate = useNavigate(); // useNavigate 훅 사용

  console.log('isModalOpen :' + isModalOpen);

  useEffect(() => {
    if (user) {
      const userData = JSON.parse(user);
      const member_id = userData.id;
      getFriendsList(member_id);
    }
  }, [user]);

  // 친구 목록 가져오는 함수
  function getFriendsList(member_id) {
    listFriends(member_id)
      .then((response) => {
        setFriendsData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // 삭제버튼 클릭 리스너
  function handleDelete(friendId) {
    const userData = JSON.parse(user);
    const member_id = userData.id;
    deleteFriend(member_id, friendId)
      .then(() => {
        setFriendsData((prev) => {
          return prev.filter((friend) => friend.userId !== friendId);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // 친구 요청 모달 열기
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 프로필 이미지 클릭 시 팝업 열기
  const handleImageClick = (friendId) => {
    setPopupFriendId(friendId);
  };

  const handleStartChat = async (friendId) => {
    try {
      // 친구와의 채팅방 번호 조회
      const memberResponse = await getMemberByUserId(friendId);
      const fId = memberResponse.data;
      console.log('fId.id:' + fId.id);
      const response = await getChatRoomNum(memberId, fId.id);
      const { userBChatRoomId, chatRoomId, userAChatRoomId } = response.data;
      console.log('userBChatRoomId :' + userBChatRoomId);
      console.log('friendId :' + friendId);
      console.log('userAChatRoomId :' + userAChatRoomId);
      // 채팅방 읽음 상태 설정
      await setLastRead(userBChatRoomId);

      // 채팅방으로 네비게이션
      navigate(`/chatRoom/${userAChatRoomId}/${fId.id}`);
    } catch (error) {
      console.error('채팅방을 여는 중 오류 발생:', error);
      alert('채팅방을 여는 중 오류가 발생했습니다.');
    } finally {
      // 팝업 닫기
      setPopupFriendId(null);
    }
  };

  return (
    <div className="myPageContainer">
      <MyPageLeftSideBar />
      <div className="rightContent">
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
          <FaUserFriends style={{ fontSize: '50px', marginRight: '10px' }} />{' '}
          친구 목록
        </h2>

        <table className="friendsTable">
          <thead>
            <tr>
              <th></th>
              <th className="tableHeader">
                <IoPersonAddSharp
                  className="addFriendIcon"
                  size={60}
                  onClick={handleOpenModal}
                />
              </th>
            </tr>
          </thead>
          <hr
            style={{
              position: 'relative',
              left: '11.8%', // 테이블보다 왼쪽으로 더 연장
              width: '724%', // 테이블보다 더 긴 수평선
              border: '1px solid #ccc',
              margin: '0',
            }}
          />
          <tbody>
            {friendsData.length > 0 ? (
              friendsData.map((friend) => {
                // Blob 데이터를 URL로 변환
                const imageUrl =
                  friend.userImage && friend.userImage.length > 0
                    ? `data:${friend.imageMimeType};base64,${friend.userImage}`
                    : defaultImage; // userImage가 없으면 기본 이미지 사용

                return (
                  <tr key={friend.id}>
                    <td colSpan="2" style={{ position: 'relative' }}>
                      <div className="friendRow">
                        <div className="friendItem">
                          <button
                            className="btn image-btn"
                            onClick={() => handleImageClick(friend.userId)}
                          >
                            <img
                              src={imageUrl}
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
                          {friend.name} ({friend.userId})
                        </div>
                        <div className="deleteButton">
                          <TiUserDelete
                            size={65}
                            onClick={() => {
                              const id = friend.userId;
                              handleDelete(id);
                            }}
                          />
                        </div>
                      </div>
                      {/* 팝업 버튼 */}
                      {popupFriendId === friend.userId && (
                        <div className="popup">
                          <button
                            className="popupButton"
                            onClick={() => handleStartChat(friend.userId)}
                          >
                            1:1 대화
                          </button>
                          <button
                            className="popupCloseButton"
                            onClick={() => setPopupFriendId(null)}
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="2"
                  style={{ fontWeight: 'bold', fontSize: '20px' }}
                >
                  <br />
                  친구가 없습니다.
                  <br />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <FriendsRequestModal
          memberId={memberId}
          onClose={handleCloseModal} // 모달 닫기 함수 전달
        />
      )}
    </div>
  );
};

export default FriendsList;
