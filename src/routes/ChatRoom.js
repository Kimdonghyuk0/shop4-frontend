import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  setLastRead,
  getMessageList,
  sendMessage,
  getChatRoomNum,
} from '../services/ChatService';
import defaultImage from '../../src/images/default.jpg';
import './css/ChatRoom.css';
import { IoIosSend } from 'react-icons/io';
const ChatRoom = () => {
  const { userChatRoomId, friendId } = useParams(); // URL에서 파라미터 추출
  const [messages, setMessages] = useState([]);
  const [chatRoomInfo, setChatRoomInfo] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [sender, setSender] = useState(null); // 현재 로그인한 사용자 ID

  useEffect(() => {
    // 현재 로그인한 사용자 정보 가져오기
    const user = sessionStorage.getItem('user');
    const memberId = JSON.parse(user)?.id;
    setSender(memberId);

    if (userChatRoomId && memberId) {
      // 채팅방에 입장했을 때 setLastRead 호출
      setLastRead(userChatRoomId);

      // 메시지 목록 가져오기
      fetchMessages(userChatRoomId);

      // 채팅방 정보 가져오기
      fetchChatRoomInfo(memberId, friendId);
    }
  }, [userChatRoomId, friendId]);

  const fetchMessages = async (userChatRoomId) => {
    try {
      const response = await getMessageList(userChatRoomId);
      setMessages(response.data);
    } catch (error) {
      console.error('메시지 목록을 가져오는 중 오류 발생:', error);
    }
  };

  const fetchChatRoomInfo = async (memberId, friendId) => {
    try {
      // 이미 friendId를 알고 있으므로 이를 사용하여 채팅방 정보를 가져옴
      const response = await getChatRoomNum(memberId, friendId);
      setChatRoomInfo(response.data);
    } catch (error) {
      console.error('채팅방 정보를 가져오는 중 오류 발생:', error);
    }
  };

  // 메시지 전송 핸들러
  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;

    const messageData = {
      chatRoom: chatRoomInfo.chatRoomId,
      sender: sender,
      content: messageContent,
      senderUserChatRoomId: chatRoomInfo.userAChatRoomId,
      recipientUserChatRoomId: chatRoomInfo.userBChatRoomId,
    };

    try {
      await sendMessage(messageData);
      setMessageContent(''); // 입력창 초기화
      fetchMessages(userChatRoomId); // 메시지 목록 갱신
    } catch (error) {
      console.error('메시지 전송 중 오류 발생:', error);
    }
  };

  return (
    <div className="chatRoomContainer">
      <div className="messagesContainer">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`messageItem ${
              message.sender.id === sender ? 'sent' : 'received'
            }`}
          >
            <img
              src={
                message.sender.userImage
                  ? `data:image/jpeg;base64,${message.sender.userImage}`
                  : defaultImage
              }
              alt="Profile"
              className="profile-img"
            />
            <div className="messageContent">
              <div className="senderName">{message.sender.name}</div>
              <div className="messageText">{message.content}</div>
              <div className="timestamp">
                {new Date(message.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="messageInputContainer">
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />

        <IoIosSend onClick={handleSendMessage} size={50} />
      </div>
    </div>
  );
};

export default ChatRoom;
