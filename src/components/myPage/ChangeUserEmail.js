import { toast } from "react-toastify";
import React, { useState } from "react";
import { updateMember } from "../../services/MemberService.js";

function ChangeUserEmail({ user, setUser }) {
  const [userEmail, setUserEmail] = useState(user.email);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  // 이메일 형식 검사 함수
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 이메일 변경 로직
  const changeUserEmail = () => {
    if (!validateEmail(userEmail)) {
      toast.error("유효하지 않은 이메일 형식입니다.");
      return;
    }

    // 변경된 내용이 없으면 변경하지 않음
    if (userEmail === user.email) {
      toast.info("이메일이 변경되지 않았습니다.");
      setIsEditingEmail(false);
      return;
    }

    // 이메일 저장 로직 추가
    setIsEditingEmail(false);
    let member = { email: userEmail };

    // Update email via API call
    updateMember(user.id, member)
      .then((res) => {
        const updatedUser = { ...user, email: userEmail }; // user 변수 중 email 값만 변경
        setUser(updatedUser); // 마이페이지의 user 변수에 값 저장
        console.log("이메일 변경 성공!");
        sessionStorage.setItem("user", JSON.stringify(res.data)); // 세션스토리지의 user의 email 내용 반영
        toast.success("이메일 변경이 완료되었습니다."); // Show success toast
      })
      .catch((error) => {
        console.error("이메일 변경 실패", error);
        toast.error("이메일 변경에 실패했습니다."); // Show error toast
      });
  };

  // Enter 키가 눌리면 변경 버튼이 클릭되도록 설정
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      changeUserEmail();
    }
  };

  // 취소 버튼 클릭 시 편집 모드 취소 및 원래 이메일 값 복원
  const cancelEdit = () => {
    setUserEmail(user.email);
    setIsEditingEmail(false);
  };

  return (
    <>
      {/* 이메일 부분 */}
      <div className="list" onKeyDown={handleKeyDown}>
        <div>
          <label>이메일 주소</label>
          <br />

          {isEditingEmail ? (
            <input
              type="email"
              className="form-control"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
          ) : (
            <span>{userEmail}</span>
          )}
        </div>

        {isEditingEmail ? (
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button className="btn" type="submit" onClick={changeUserEmail}>
              저장
            </button>
            <button className="btn" type="button" onClick={cancelEdit}>
              취소
            </button>
          </div>
        ) : (
          <button
            className="btn"
            type="button"
            onClick={() => setIsEditingEmail(true)}
          >
            변경
          </button>
        )}
      </div>
    </>
  );
}

export default ChangeUserEmail;
