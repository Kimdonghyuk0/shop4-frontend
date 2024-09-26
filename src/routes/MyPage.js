import "./css/MyPage.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyPageLeftSideBar from "../components/MyPageLeftSideBar.js";
import MyPageSection1 from "../components/myPage/MyPageSection1.js";
import MyPageSection2 from "../components/myPage/MyPageSection2.js";
import MyPageSection3 from "../components/myPage/MyPageSection3.js";

const MyPage = () => {
  const userSession = JSON.parse(sessionStorage.getItem("user")); // 세션에서 사용자 이	름 가져오기
  const isLoggedIn = sessionStorage.getItem("isLoggedIn"); // 로그인 여부 확인
  let [user, setUser] = useState(userSession);

  let navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate("/login"); // 로그인되지 않았거나 사용자 정보가 없는 경우 로그인 페이지로 이동
      return;
    }
  }, [isLoggedIn, user]);

  if (!user) {
    return null; // user가 null일 경우 컴포넌트를 렌더링하지 않음
  }

  return (
    <>
      <div className="myPageContainer">
        <MyPageLeftSideBar />
        {/* 오른쪽 부분 */}
        <div className="rightContent">
          <h4 style={{ marginTop: "20px", fontWeight: "bold" }}>프로필 정보</h4>
          <hr
            style={{
              border: "none",
              width: "80%",
              height: "5px",
              backgroundColor: "black",
            }}
          />

          {/* 이미지랑 이름 */}
          <MyPageSection1 user={user} setUser={setUser} />

          <hr style={{ width: "80%" }} />
          <br />

          {/* 로그인 정보 블록 */}
          <MyPageSection2 user={user} setUser={setUser} />

          {/* 개인 정보 칸 */}
          <MyPageSection3 user={user} />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default MyPage;
