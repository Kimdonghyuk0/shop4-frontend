import { toast } from "react-toastify";
import { useState } from "react";
import { updateMember } from "../../services/MemberService.js";

function ChangeUserName({ user }) {
  const [userName, setUserName] = useState(user.name);
  const [isEditingUserName, setIsEditingUserName] = useState(false);
  const [tempUserName, setTempUserName] = useState(user.name);

  // 이름 변경 로직
  const changeUserName = () => {
    const isUserNameTooShort = userName.length < 1;

    // 1자라도 입력해야 실행
    if (isUserNameTooShort) {
      toast.error("이름을 입력해주세요!");
      return;
    }

    // 기존 이름과 같으면 변경하지 않음
    if (userName === tempUserName) {
      toast.info("이름이 변경되지 않았습니다.");
      setIsEditingUserName(false);
      return;
    }

    let member = { name: userName };

    // 이름 변경 API 요청
    updateMember(user.id, member)
      .then((res) => {
        sessionStorage.setItem("user", JSON.stringify(res.data));
        toast.success("이름 변경이 완료되었습니다.");
        setIsEditingUserName(false);
        setTempUserName(userName); // 변경 성공 후 tempUserName을 업데이트
      })
      .catch((error) => {
        console.error("이름 변경 실패", error);
        toast.error("이름 변경에 실패했습니다.");
      });
  };

  // Enter 키가 눌리면 변경 버튼이 클릭되도록 설정
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      changeUserName();
    }
  };

  // 취소 시 원래 이름으로 복원
  const cancelEdit = () => {
    setUserName(tempUserName);
    setIsEditingUserName(false);
  };

  return (
    <>
      <div className="list" onKeyDown={handleKeyDown}>
        <div>
          <label>이름</label> <br />
          {isEditingUserName ? (
            <input
              type="text"
              className="form-control"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          ) : (
            <span>{userName}</span>
          )}
        </div>

        {isEditingUserName ? (
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button className="btn" type="submit" onClick={changeUserName}>
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
            onClick={() => setIsEditingUserName(true)}
          >
            변경
          </button>
        )}
      </div>
    </>
  );
}

export default ChangeUserName;
