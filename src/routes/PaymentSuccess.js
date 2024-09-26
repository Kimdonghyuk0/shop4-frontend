import styles from "./css/PaymentSuccess.module.css";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className={styles.successContainer}>
      <FaCheckCircle className={styles.successIcon} />
      <h2 className={styles.message}>결제가 완료되었습니다. 감사합니다!</h2>
      <p className={styles.subMessage}>
        주문 내역은 마이페이지에서 확인하실 수 있습니다.
      </p>
      <div className={styles.buttonContainer}>
        <button className={styles.homeButton} onClick={() => navigate("/")}>
          홈으로 가기
        </button>
        <button
          className={styles.ordersButton}
          onClick={() => navigate("/mypage/orders")}
        >
          주문 내역 확인
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;
