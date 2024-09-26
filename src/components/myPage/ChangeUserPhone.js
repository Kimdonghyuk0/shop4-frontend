import { toast } from "react-toastify";
import { useState } from "react";
import { updateMember } from "../../services/MemberService.js";

function ChangeUserPhone({ user }) {
  const [userPhone, setUserPhone] = useState(user.phone);
  const [isEditingUserPhone, setIsEditingUserPhone] = useState(false);
  const [tempUserPhone, setTempUserPhone] = useState(user.phone);

  // 전화번호 변경 로직
  const changeUserPhone = () => {
    const isUserPhoneTooShort = userPhone.length < 1;

    // 1자라도 입력해야 실행
    if (isUserPhoneTooShort) {
      toast.error("전화번호를 입력해주세요!");
      return;
    }

    // 기존 전화번호와 같으면 변경하지 않음
    if (userPhone === tempUserPhone) {
      toast.info("전화번호가 변경되지 않았습니다.");
      setIsEditingUserPhone(false);
      return;
    }

    let member = { phone: userPhone };

    // 전화번호 변경 API 요청
    updateMember(user.id, member)
      .then((res) => {
        sessionStorage.setItem("user", JSON.stringify(res.data));
        toast.success("전화번호 변경이 완료되었습니다.");
        setIsEditingUserPhone(false);
      })
      .catch((error) => {
        console.error("전화번호 변경 실패", error);
        toast.error("전화번호 변경에 실패했습니다.");
      });
  };

  // Enter 키가 눌리면 변경 버튼이 클릭되도록 설정
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      changeUserPhone();
    }
  };

  // 취소 시 원래 전화번호로 복원
  const cancelEdit = () => {
    setUserPhone(tempUserPhone);
    setIsEditingUserPhone(false);
  };

  return (
    <>
      <div className="list" onKeyDown={handleKeyDown}>
        <div>
          <label>전화번호</label> <br />
          {isEditingUserPhone ? (
            <input
              type="text"
              className="form-control"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
            />
          ) : (
            <span>{userPhone}</span>
          )}
        </div>

        {isEditingUserPhone ? (
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button className="btn" type="submit" onClick={changeUserPhone}>
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
            onClick={() => setIsEditingUserPhone(true)}
          >
            변경
          </button>
        )}
      </div>
    </>
  );
}

export default ChangeUserPhone;
