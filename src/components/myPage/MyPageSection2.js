import React, { useState } from "react";
import MemberPwUpdate from "./MemberPwUpdate.js";
import ChangeUserEmail from "./ChangeUserEmail.js";

// 로그인 정보 컴포넌트 (이메일, 비밀번호)
function MyPageSection2({ user, setUser }) {
  // 모달 창
  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className="myPageSection2">
        <h5 style={{ fontWeight: "bold" }}>로그인 정보</h5>
        {/* 이메일 부분 */}
        <ChangeUserEmail user={user} setUser={setUser} />

        {/* 비밀번호 부분 */}
        <div className="list">
          <div>
            <label>비밀번호</label>
            <br />

            <span>{"●".repeat(8)}</span>
          </div>
          <button
            className="btn"
            type="button"
            onClick={() => {
              setModalOpen(true);
            }}
          >
            변경
          </button>

          {modalOpen && (
            <MemberPwUpdate
              closeModal={closeModal}
              user={user}
              setUser={setUser}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default MyPageSection2;
