import React, { useState } from "react";
import { toast } from "react-toastify";
import { updateMember } from "../../services/MemberService.js";
import styles from "../../routes/css/MemberPwUpdate.module.css";

function MemberPwUpdate({ closeModal, user, setUser }) {
  const [userPw, setUserPw] = useState(user.userPw);
  const [currentUserPw, setCurrentUserPw] = useState("");
  const [newUserPw, setNewUserPw] = useState("");
  const [confirmUserPw, setConfirmUserPw] = useState("");
  const maxLength = 20;
  const [confirmCurrentUserPw, setConfirmCurrentUserPw] = useState(false);
  const [confirmNewUserPw, setConfirmNewUserPw] = useState(false);
  const [confirmEmptyNewUserPw, setConfirmEmptyNewUserPw] = useState(false);

  const handleCurrentUserPw = (event) => {
    setCurrentUserPw(event.target.value);
  };
  const handleNewUserPw = (e) => {
    setNewUserPw(e.target.value);
  };
  const handleConfirmUserPw = (e) => {
    setConfirmUserPw(e.target.value);
  };

  const changeUserPw = () => {
    const isCurrentPwIncorrect = currentUserPw !== userPw;
    const isNewPwMismatch = newUserPw !== confirmUserPw;
    const isNewPwTooShort = newUserPw.length < 1;

    setConfirmCurrentUserPw(isCurrentPwIncorrect);
    setConfirmNewUserPw(isNewPwMismatch);
    setConfirmEmptyNewUserPw(isNewPwTooShort);

    if (!isCurrentPwIncorrect && !isNewPwMismatch && !isNewPwTooShort) {
      let member = { userPw: newUserPw };
      updateMember(user.id, member)
        .then((res) => {
          const updatedUser = { ...user, userPw: newUserPw };
          setUser(updatedUser);
          sessionStorage.setItem("user", JSON.stringify(res.data));
          toast.success("비밀번호 변경이 완료되었습니다.");
          closeModal();
        })
        .catch((error) => {
          toast.error("비밀번호 변경에 실패했습니다.");
        });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      changeUserPw();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} onKeyDown={handleKeyDown}>
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
          비밀번호 변경
        </h3>
        <hr />

        {/* 현재 비밀번호 입력 */}
        <div className={styles.inputContainer}>
          <input
            type="password"
            value={currentUserPw}
            placeholder="현재 비밀번호"
            onChange={handleCurrentUserPw}
            className={styles.input}
          />
          {confirmCurrentUserPw && (
            <span className={styles.error}>
              현재 비밀번호가 일치하지 않습니다.
            </span>
          )}
          <span className={styles.charCount}>
            {currentUserPw.length}/{maxLength}
          </span>
        </div>

        {/* 새 비밀번호 입력 */}
        <div className={styles.inputContainer}>
          <input
            type="password"
            value={newUserPw}
            placeholder="새 비밀번호"
            onChange={handleNewUserPw}
            className={styles.input}
          />
          {confirmEmptyNewUserPw && (
            <span className={styles.error}>비밀번호를 입력해주세요!</span>
          )}
          <span className={styles.charCount}>
            {newUserPw.length}/{maxLength}
          </span>
        </div>

        {/* 비밀번호 확인 */}
        <div className={styles.inputContainer}>
          <input
            type="password"
            value={confirmUserPw}
            placeholder="비밀번호 확인"
            onChange={handleConfirmUserPw}
            className={styles.input}
          />
          {confirmNewUserPw && (
            <span className={styles.error}>
              새 비밀번호가 일치하지 않습니다.
            </span>
          )}
          <span className={styles.charCount}>
            {confirmUserPw.length}/{maxLength}
          </span>
        </div>

        {/* 버튼 영역 */}
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={changeUserPw}>
            변경
          </button>
          <button
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={closeModal}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default MemberPwUpdate;
