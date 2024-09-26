import React, { useState, useEffect } from 'react';
import defaultImage from '../../images/default.jpg';
import { updateProfileImage } from '../../services/MemberService';
import { getProfileImage } from '../../services/MemberService';
import { deleteProfileImage } from '../../services/MemberService';

function MyPageSection1({ user, setUser }) {
  const [image, setImage] = useState(defaultImage);
  //서버에서 blob으로 받는거라 redux로 이미지 관리가 힘듦.
  //redux로 저장하고싶으면 Base64로 인코딩해서 저장해야함.
  //서버에 이미지 올리고 url받는게 젤 깔끔한듯.
  //서버에서 바이너리 코드를 받는다->url로 변경한다->이 url을 이용한다. but 이 url은 새로고침하면 리셋된다.

  useEffect(() => {
    fetchProfileImage();
  }, []);

  const fetchProfileImage = async () => {
    try {
      // Binary Large Objects(blob)를 get함
      const response = await getProfileImage(user.id, { responseType: 'blob' }); // 응답 타입을 blob으로 설정s

      if (response.status === 200) {
        const blob = response.data; // 바이너리 데이터(Blob)를 받아옴
        if (blob.size === 0) {
          setImage(defaultImage);
        } else {
          const imageUrl = URL.createObjectURL(blob); // Blob 데이터를 URL로 변환
          console.log(imageUrl);
          setImage(imageUrl);
          const updatedUser = { ...user, userImage: imageUrl };
          setUser(updatedUser);
          sessionStorage.setItem('user', JSON.stringify(updatedUser)); //세션에 저장할 필요는 없는데 형식상 저장함. 어차피 새로고침하면 url리셋되서 의미없음
        }
      } else {
        console.error('Failed to fetch profile image');
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  // 프사 변경
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file); //폼데이터로 전송, 백엔드에서는 이를 바이너리코드로 저장

      try {
        await updateProfileImage(user.id, formData);
        console.log('이미지 업데이트 성공');
        fetchProfileImage();
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };
  //프사 삭제
  const deleteMyProfileImage = async () => {
    try {
      console.log('프로필 이미지 삭제 시도');
      deleteProfileImage(user.id);
      setImage(defaultImage); // 이미지 삭제 후 기본 이미지로 설정
      console.log('프로필 이미지 삭제 성공');
    } catch (error) {
      console.error('프로필 이미지 삭제 실패:', error);
    }
  };

  return (
    <>
      <div className="myPageSection1">
        <div className="profile-info">
          <button className="btn image-btn">
            <img src={image} alt="Profile" className="profile-img" />
          </button>
          <div className="text-info">
            <span className="user-name">{user.name} 님</span>
            <input
              type="file"
              accept="image/*"
              id="imageUpload"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <label htmlFor="imageUpload" className="btn upload-btn">
              이미지 변경
            </label>
            <button
              className="btn delete-btn"
              onClick={() => deleteMyProfileImage()}
            >
              삭제
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .myPageSection1 {
          display: flex;
          align-items: center;
          padding: 15px;
          margin-left: 0;
        }

        .profile-info {
          display: flex;
          align-items: center;
        }

        .profile-img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .profile-img:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        .text-info {
          margin-left: 20px;
        }

        .user-name {
          font-weight: bold;
          font-size: 26px;
          display: block;
          margin-bottom: 10px;
          color: #333;
        }

        .btn {
          font-size: 14px;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .upload-btn {
          background-color: #4caf50;
          color: white;
          margin-right: 10px;
          margin-bottom: -8px;
        }

        .upload-btn:hover {
          background-color: #45a049;
        }

        .delete-btn {
          background-color: #ff4d4d;
          color: white;
        }

        .delete-btn:hover {
          background-color: #e60000;
        }
      `}</style>
    </>
  );
}

export default MyPageSection1;
