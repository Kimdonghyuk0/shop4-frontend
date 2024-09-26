import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../routes/css/MyPage.css";
import { useSelector } from "react-redux";

const MyPageLeftSideBar = () => {
  const requestedFriends = useSelector(
    (state) => state.friendRequests.requestedFriends
  );
  let friendRequestsCount = requestedFriends.length;

  return (
    <div className="myPageContainer">
      <div className="leftContent">
        <ul>
          <br></br>
          <h5 className="headLine" style={{ fontSize: "25px" }}>
            내 정보
          </h5>
          <hr />
          <li>
            <Link to="/myPage">프로필 정보</Link>
          </li>
          <li>
            <Link to="/addressBook">주소록</Link>
          </li>
          <li>
            <Link to="/myCoupons">쿠폰함</Link>
          </li>
          <li>
            <Link to="/friendsList">친구 목록</Link>
          </li>
          <li style={{ position: "relative" }}>
            <Link to="/requestedFriends">친구 요청</Link>
            {friendRequestsCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "50%", // 이미 원형이지만, 패딩과 크기 조정으로 더 동그랗게
                  padding: "5px 8px", // 패딩을 늘려서 배지를 더 크게
                  fontSize: "12px",
                  minWidth: "20px", // 최소 너비 설정으로 배지가 너무 작아 보이지 않도록
                  height: "20px", // 높이 설정으로 더 정확한 원형 유지
                  display: "flex", // 내용을 중앙에 위치시키기
                  alignItems: "center", // 수직 중앙 정렬
                  justifyContent: "center", // 수평 중앙 정렬
                }}
              >
                {friendRequestsCount}
              </span>
            )}
          </li>
          <li>
            <Link to="/paymentInfo">결제 정보</Link>
          </li>
        </ul>
        <br />
        <ul>
          <h5 style={{ fontSize: "25px" }}>쇼핑 정보</h5>
          <hr />
          <li>
            <Link to="/purchaseHistory">구매 내역</Link>
          </li>
          <li>
            <Link to="/wishlist">관심 상품</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MyPageLeftSideBar;
