import styles from "./css/SignUp.module.css";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createMember } from "../services/MemberService";
import axios from "axios";
import defaultImage from "../images/default.jpg";
import cameraImage from "../images/cameraImage.png";

function SignUp() {
  const navigate = useNavigate();

  const [image, setImage] = useState(defaultImage);
  // json형태로 변수 선언 후에 값 입력받기 (아이디, 비밀번호, 생년월일, 성별)
  const [formData, setFormData] = useState({
    userId: "",
    userPw: "",
    name: "",
    phone: "",
    email: "",
    birth: "",
    userImage: image,
  });

  // 비밀번호 확인 변수
  const handleConfirmPwChange = (e) => {
    setConfirmPw(e.target.value);
  };

  // 중복 되는지 확인하는 변수
  const [isIdUnique, setIsIdUnique] = useState(false);
  const [confirmPw, setConfirmPw] = useState(""); // 비밀번호 확인 상태 추가
  const [isEqualConfirmPw, setIsEqualConfirmPw] = useState(false);
  const [isPhoneOnlyNumber, setisPhoneOnlyNumber] = useState(false);
  const [confirmNewUserPw, setConfirmNewUserPw] = useState(false);
  const [birthError, setBirthError] = useState(false);

  // 생년월일 입력 필드를 별도로 관리
  const handleYearChange = (e) => {
    setYear(e.target.value);
    setFormData((prevState) => ({
      ...prevState,
      birth: `${e.target.value}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`,
    }));
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setFormData((prevState) => ({
      ...prevState,
      birth: `${year}-${String(e.target.value).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`,
    }));
  };

  const handleDayChange = (e) => {
    setDay(e.target.value);
    setFormData((prevState) => ({
      ...prevState,
      birth: `${year}-${String(month).padStart(2, "0")}-${String(
        e.target.value
      ).padStart(2, "0")}`,
    }));
  };

  // input으로 입력받는 값들 저장
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  // 전화번호 입력값에 대해 포맷팅 적용
  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: formatPhoneNumber(value),
    }));
  };

  // 전화번호 포맷 함수
  const formatPhoneNumber = (value) => {
    // 숫자만 추출
    const cleaned = ("" + value).replace(/\D/g, "");
    // 전화번호 포맷팅
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 7)
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(
      7,
      11
    )}`;
  };

  //생년월일 비어있는 칸 있는지 확인
  const confirmBirth = () => {
    const isEmptyBirth = year === "" || month === "" || day === "";
    setBirthError(isEmptyBirth);
    return isEmptyBirth;
  };

  //비밀번호 길이 확인 함수
  const confirmPwLength = () => {
    const isNewPwTooShort = formData.userPw.length < 1;
    setConfirmNewUserPw(isNewPwTooShort);
    return isNewPwTooShort;
  };

  //전화번호 검증함수
  const confirmPhone = () => {
    const isCurrentPhoneOnlyNumber = formData.phone.length !== 13;
    setisPhoneOnlyNumber(isCurrentPhoneOnlyNumber);
    return isCurrentPhoneOnlyNumber;
  };

  //비밀번호 검증함수
  const confirmCorrectPw = () => {
    const isCurrentPwIncorrect = confirmPw !== formData.userPw;
    setIsEqualConfirmPw(isCurrentPwIncorrect);
    return isCurrentPwIncorrect;
  };

  // 빈칸 검증하는 함수
  const validateForm = () => {
    console.log(
      Object.values(formData).every((value) => {
        // value가 파일 객체일 경우엔 그냥 true 반환 (빈칸 검증하지 않음)
        if (value instanceof File) {
          return true; // 파일은 무조건 true로 처리
        }
        // 파일이 아닐 경우엔 문자열로 간주하고 trim() 검증
        return value.trim() !== "";
      })
    );

    return Object.values(formData).every((value) => {
      if (value instanceof File) {
        return true; // 파일은 검증 통과
      }
      return value.trim() !== ""; // 문자열은 trim()을 사용해 검증
    });
  };

  // 회원가입
  const onSubmit = async (e) => {
    e.preventDefault();

    // 중복확인 했는지 확인ㅎ
    if (!isIdUnique) {
      alert("중복확인 해주세요");
      return;
    }

    //비밀번호 길이 1자 이상인지 확인
    if (confirmPwLength()) {
      return;
    }

    //비밀번호 확인이랑 비밀번호랑 같은지 확인
    if (confirmCorrectPw()) {
      return;
    }

    //전화번호 숫자로 11자리 입력했는지 확인
    if (confirmPhone()) {
      return;
    }

    //생년월일 다 입력했는지 확인
    if (confirmBirth()) {
      return;
    }

    // 빈칸 확인
    if (!validateForm()) {
      alert("모든 필드를 채워주세요.");
      return;
    }

    // FormData 객체 생성
    const formDataToSend = new FormData();
    formDataToSend.append("userId", formData.userId);
    formDataToSend.append("userPw", formData.userPw);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("birth", formData.birth);
    formDataToSend.append("cash", 0); // 기본 값 추가
    formDataToSend.append("file", formData.userImage); // 이미지 파일 추가

    // 회원가입 서버에 요청
    try {
      await createMember(formDataToSend);
      alert("회원가입이 완료되었습니다.");
      navigate("/SignUpSuccess"); // 회원가입 완료 후 홈으로 이동
    } catch (error) {
      alert("회원가입에 실패하였습니다.");
      console.error(error);
    }
  };

  //아이디 중복확인
  const checkDuplicate = async () => {
    if (formData.userId.length === 0) {
      alert("아이디를 입력해주세요.");
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:8080/api/members/check/${formData.userId}`
      );
      if (res.data) {
        alert("중복된 아이디입니다. 다른 아이디를 사용해주세요.");
        setIsIdUnique(false);
      } else {
        alert("사용 가능한 아이디입니다.");
        setIsIdUnique(true);
      }
    } catch (error) {
      console.error("아이디 중복 확인에 실패했습니다.", error);
      alert("서버에 문제가 발생했습니다. 나중에 다시 시도해주세요.");
    }
  };

  //이메일 입력받기
  const [emailPrefix, setEmailPrefix] = useState("");
  const [domain, setDomain] = useState("gmail.com");
  const [isCustomDomain, setIsCustomDomain] = useState(false); // 직접입력 여부 관리

  // 이메일의 prefix부분
  const handlePrefixChange = (e) => {
    setEmailPrefix(e.target.value);
  };

  // 이메일의 도메인 부분
  const handleDomainChange = (e) => {
    const selectedDomain = e.target.value;
    if (selectedDomain === "none") {
      setIsCustomDomain(true); // 직접입력을 활성화
      setDomain(""); // 빈 값으로 설정
    } else {
      setIsCustomDomain(false); // 직접입력 비활성화
      setDomain(selectedDomain); // 선택한 도메인을 설정
    }
  };

  // 이메일 prefix랑 domain 합치기
  const handleEmailChange = () => {
    setFormData((prevState) => ({
      ...prevState,
      email: `${emailPrefix}@${domain}`,
    }));
  };

  // 입력받은 생년월일
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  // 연도, 월, 일 목록 생성
  const years = Array.from({ length: 100 }, (_, i) => 2024 - i); // 1924년부터 2024년까지
  const months = Array.from({ length: 12 }, (_, i) => i + 1); // 1월부터 12월까지
  const days = Array.from({ length: 31 }, (_, i) => i + 1); // 1일부터 31일까지

  // 이미지 업로드 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // 사용자가 업로드한 첫 번째 파일
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        userImage: file,
      }));

      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // 이미지를 미리보기로 설정
      };
      reader.readAsDataURL(file); // 파일을 Data URL 형식으로 읽음
    }
  };

  // 파일 선택창을 트리거하는 함수
  const triggerFileInput = (e) => {
    e.preventDefault();
    document.getElementById("imageUpload").click(); // 숨겨진 input 클릭
  };

  const [showDropdown, setShowDropdown] = useState(false); // 드롭다운 상태

  const handleSetDefaultImage = (e) => {
    e.preventDefault();
    setImage(defaultImage); // 기본 이미지로 설정
  };

  const dropdownRef = useRef(null);
  const toggleDropdown = (e) => {
    setShowDropdown(!showDropdown); // 드롭다운 토글
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown(); // 드롭다운 외부 클릭 시 닫기
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className={styles.signUpContainer}>
        <form className={styles.signUpForm} onSubmit={onSubmit}>
          <h2
            className="title"
            style={{ marginTop: "20px", textAlign: "center" }}
          >
            회원가입
          </h2>

          {/* 이미지 변경 버튼 */}
          <div className={styles.profileInfo}>
            <img src={image} alt="Profile" className={styles.profileImg} />

            {/* 동그라미 버튼 (드롭다운 메뉴 트리거) */}
            <button
              type="button"
              className={styles.circleButton}
              onClick={toggleDropdown}
            >
              <img src={cameraImage} alt="아이콘" className={styles.icon} />
            </button>

            {/* 드롭다운 메뉴 */}
            {showDropdown && (
              <div className={styles.dropdownMenu} ref={dropdownRef}>
                <button
                  className={styles.dropdownItem}
                  onClick={triggerFileInput}
                >
                  사진 변경
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={handleSetDefaultImage}
                >
                  기본 이미지로 변경
                </button>
              </div>
            )}

            {/* 파일 입력 (숨김) */}
            <input
              type="file"
              accept="image/*"
              id="imageUpload"
              style={{ display: "none" }}
              onChange={handleImageChange} // 파일 선택 시 이미지 변경
            />
          </div>

          {/* 아이디 입력 및 중복확인 태그 */}
          <label
            htmlFor="userId"
            className="form-label"
            style={{ marginBottom: "0" }}
          >
            아이디
          </label>
          <div className="mb-3 position-relative">
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className={`formControl ${styles.input}`}
              placeholder="아이디"
              style={{ height: "50px", paddingRight: "120px" }}
            />
            <button
              type="button"
              className={`btn btn-primary position-absolute ${styles.button}`}
              style={{
                width: "100px",
                height: "40px",
                fontSize: "0.875rem",
                right: "5px",
                top: "-19px",
              }}
              onClick={checkDuplicate}
            >
              중복 확인
            </button>
          </div>

          {/* 비밀번호 */}
          <label
            htmlFor="pw"
            className="form-label"
            style={{ marginBottom: "0" }}
          >
            비밀번호
            {confirmNewUserPw && (
              <span className={styles.error}>
                비밀번호가 길이가 너무 짧습니다
              </span>
            )}
          </label>
          <div className="mb-3">
            <input
              type="password"
              name="userPw"
              onChange={handleChange}
              className={`formControl ${styles.input}`}
              placeholder="비밀번호 입력(문자, 숫자, 특수문자 포함 8~20자)"
              style={{ height: "50px" }}
            />
          </div>

          {/* 비밀번호 확인 */}
          <label
            htmlFor="confirmPw"
            className="form-label"
            style={{ marginBottom: "0" }}
          >
            비밀번호 확인
            {isEqualConfirmPw && (
              <span className={styles.error}>
                새 비밀번호가 일치하지 않습니다.
              </span>
            )}
          </label>

          <div className="mb-3">
            <input
              type="password"
              name="confirmPw"
              onChange={handleConfirmPwChange}
              className={`formControl ${styles.input}`}
              placeholder="비밀번호 재입력"
              style={{ height: "50px" }}
            />
          </div>

          {/* 이름 */}
          <label
            htmlFor="name"
            className="form-label"
            style={{ marginBottom: "0" }}
          >
            이름
          </label>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              onChange={handleChange}
              className={`formControl ${styles.input}`}
              placeholder="이름을 입력해주세요."
              style={{ height: "50px" }}
            />
          </div>

          {/* 전화번호 */}
          <label
            htmlFor="phone"
            className="form-label"
            style={{ marginBottom: "0" }}
          >
            전화번호
            {isPhoneOnlyNumber && (
              <span className={styles.error}>숫자로 11자리 입력해주세요.</span>
            )}
          </label>
          <div className="mb-3">
            <input
              type="text"
              name="phone"
              onChange={handlePhoneChange}
              className={`formControl ${styles.input}`}
              placeholder="휴대폰 번호 입력('-'제외 11자리 입력)"
              style={{ height: "50px" }}
            />
          </div>

          {/* 이메일 */}
          <label
            htmlFor="email"
            className="form-label"
            style={{ marginBottom: "0" }}
          >
            이메일
          </label>
          <div className={styles.inputContainer} name="email">
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                value={emailPrefix}
                onChange={(e) => {
                  handlePrefixChange(e);
                  handleEmailChange();
                }}
                placeholder="이메일 입력"
                className={` ${styles.input} form-control `}
                style={{ height: "50px" }}
              />
              <span className={styles.atSign}>@</span>
              <input
                type="text"
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                  handleEmailChange();
                }}
                placeholder="도메인 선택 또는 직접 입력"
                className={`${styles.input} form-control ${styles.emailDomain}`}
                style={{ height: "50px" }}
                disabled={!isCustomDomain}
              />
            </div>
            <div className={styles.selectContainer}>
              <select
                onChange={(e) => {
                  handleDomainChange(e);
                  handleEmailChange();
                }}
                className={`${styles.domainSelect}`}
              >
                <option value="gmail.com">gmail.com</option>
                <option value="yahoo.com">yahoo.com</option>
                <option value="outlook.com">outlook.com</option>
                <option value="none">직접입력</option>
              </select>
            </div>
          </div>

          <label htmlFor="year" className="form-label">
            생년월일
            {birthError && (
              <span className={styles.error}>
                년, 월, 일 모두 입력해주세요.
              </span>
            )}
          </label>
          <div className={styles.dateSelector}>
            <select
              id="year"
              value={year}
              onChange={handleYearChange}
              className={styles.formSelect}
            >
              <option value="">년도</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            년
            <select
              id="month"
              value={month}
              onChange={handleMonthChange}
              className={styles.formSelect}
            >
              <option value="">월</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            월
            <select
              id="day"
              value={day}
              onChange={handleDayChange}
              className={styles.formSelect}
            >
              <option value="">일</option>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            일
          </div>

          <button type="submit" className={`btn btn-primary ${styles.button}`}>
            회원가입
          </button>
        </form>
      </div>
    </>
  );
}

export default SignUp;
