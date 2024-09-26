import styles from "./css/Payment.module.css";
import {
  getUserCoupons,
  requestUseCoupon,
} from "../services/UserCouponService";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getMember } from "../services/MemberService";
import requestPay from "../components/RequestPay";

function Payment() {
  let userInfo = JSON.parse(sessionStorage.getItem("user"));
  let [copyUser, setCopyUser] = useState({});
  let [cartData, setCartData] = useState([]);
  let [receiver, setReceiver] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const { state } = useLocation();
  let products = Array.from(state);
  let [totalPrice, setTotalPrice] = useState(0);
  let [totalPayment, setTotalPayment] = useState(0); // 결제 금액 상태
  let [selectedDiscount, setSelectedDiscount] = useState(0); // 선택된 할인 값
  let [selectedCouponId, setSelectedCouponId] = useState(null); // 선택된 쿠폰 ID 값
  let navigator = useNavigate();

  const id = userInfo.id;

  useEffect(() => {
    const initMembers = async () => {
      await getMember(id).then((response) => {
        setCopyUser(response.data);
      });
    };
    initMembers();
  }, [id]);

  useEffect(() => {
    setCartData(products);
  }, []);

  useEffect(() => {
    let tmp = 0;
    cartData.forEach((item) => {
      tmp += item.quantity * item.goods.price;
    });
    setTotalPrice(tmp);
    setTotalPayment(tmp - (tmp * selectedDiscount) / 100); // 총 결제 금액 계산c
    console.log(selectedCouponId);
  }, [cartData, selectedDiscount]); // 선택된 할인 값이 변경될 때마다 결제 금액 업데이트

  // 쿠폰 사용 처리 함수
  const applyCoupon = async (couponId) => {
    try {
      await requestUseCoupon(couponId); // 쿠폰 사용 요청
      console.log(`Coupon ${couponId} has been used.`);
    } catch (error) {
      console.error("Failed to apply coupon:", error);
      alert("쿠폰 사용 중 오류가 발생했습니다.");
    }
  };

  const handlePayment = async () => {
    try {
      console.log(totalPayment);
      const result = await requestPay(cartData, receiver, totalPayment);
      if (result.success) {
        navigator("/paymentSuccess"); // 성공 시 paymentSuccess 페이지로 이동
      }
      if (selectedCouponId) {
        await applyCoupon(selectedCouponId); // 쿠폰 사용 처리
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(error.message || "결제 처리 중 오류가 발생했습니다.");
    }
  };

  const handleCopyBuyerInfo = () => {
    setReceiver({
      name: copyUser.name,
      phone: copyUser.phone,
      email: copyUser.email,
      address: copyUser.address,
    });
  };

  let [coupon, setCoupon] = useState([]);

  // 유저의 쿠폰이 어떤게 있는지 가져옴
  useEffect(() => {
    const initCoupon = async () => {
      await getUserCoupons(id).then((response) => {
        let getCoupons = response.data;
        const availableCoupons = getCoupons.filter(
          (coupon) => coupon.usedCoupon === false
        );
        setCoupon(availableCoupons);
      });
    };
    initCoupon();
  }, [id]);

  // 할인 쿠폰 선택 시 처리 함수
  const handleCouponChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption = e.target.selectedOptions[0]; // 선택된 옵션의 전체 데이터 가져오기
    const couponId = selectedOption.getAttribute("data-id"); // 옵션에 저장된 쿠폰 ID 가져오기
    setSelectedDiscount(parseFloat(selectedValue)); // 선택된 할인 퍼센트 설정
    setSelectedCouponId(couponId); // 선택된 쿠폰 ID 저장
  };

  return (
    <div className={styles.paymentContainer}>
      <div className={styles.section1}>
        <h2>Order Summary</h2>
        <OrderList cartData={cartData} />
      </div>

      <div className={styles.section2}>
        <h2>Buyer Information</h2>
        <div className={styles.buyerSection}>
          <h3>Buyer</h3>
          <span>Name</span>
          <input
            type="text"
            className={styles.formControl}
            placeholder={copyUser.name}
            readOnly
          />
          <span>Phone</span>
          <input
            type="text"
            className={styles.formControl}
            placeholder={copyUser.phone}
            readOnly
          />
          <span>Email</span>
          <input
            type="text"
            className={styles.formControl}
            placeholder={copyUser.email}
            readOnly
          />
          <span>Address</span>
          <input
            type="text"
            className={styles.formControl}
            placeholder={copyUser.address}
            readOnly
          />
        </div>

        <div className={styles.receiverSection}>
          <h3>Receiver Information</h3>
          <button className={styles.copyButton} onClick={handleCopyBuyerInfo}>
            Copy Buyer Info
          </button>
          <span>Name</span>
          <input
            type="text"
            className={styles.formControl}
            value={receiver.name}
            onChange={(e) => setReceiver({ ...receiver, name: e.target.value })}
          />
          <span>Phone</span>
          <input
            type="text"
            className={styles.formControl}
            value={receiver.phone}
            onChange={(e) =>
              setReceiver({ ...receiver, phone: e.target.value })
            }
          />
          <span>Email</span>
          <input
            type="text"
            className={styles.formControl}
            value={receiver.email}
            onChange={(e) =>
              setReceiver({ ...receiver, email: e.target.value })
            }
          />
          <span>Address</span>
          <input
            type="text"
            className={styles.formControl}
            value={receiver.address}
            onChange={(e) =>
              setReceiver({ ...receiver, address: e.target.value })
            }
          />
        </div>
      </div>

      <div className={styles.section3}>
        <h2>Payment Information</h2>
        <table className={styles.payTable}>
          <tbody>
            <tr>
              <td>Total Price</td>
              <td>{totalPrice}</td>
            </tr>
            <tr>
              <td>Discount</td>
              <td>
                <select onChange={handleCouponChange}>
                  <option value="0">선택하세요</option> {/* 기본 선택 옵션 */}
                  {coupon.length > 0 ? (
                    coupon.map((couponItem, idx) => (
                      <option
                        key={idx}
                        value={couponItem.coupons.discount}
                        data-id={couponItem.id}
                      >
                        {couponItem.coupons.name} -{" "}
                        {couponItem.coupons.discount}% discount
                      </option>
                    ))
                  ) : (
                    <option>No available coupons</option>
                  )}
                </select>
              </td>
            </tr>
            <tr>
              <td>Total Payment</td>
              <td>{totalPayment}</td> {/* 총 결제 금액 표시 */}
            </tr>
          </tbody>
        </table>

        <button className={styles.buyButton} onClick={handlePayment}>
          Purchase
        </button>
        <button className={styles.cancelButton} onClick={() => navigator(-1)}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// OrderList 컴포넌트
function OrderList({ cartData }) {
  return (
    <table className={styles.orderTable}>
      <thead>
        <tr>
          <th>Item</th>
          <th>Name</th>
          <th>Option</th>
          <th>Price</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>
        {cartData.map((item) => (
          <tr key={item.id}>
            <td>사진</td>
            <td>{item.goods.name}</td>
            <td>옵션</td>
            <td>{item.goods.price}</td>
            <td>{item.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Payment;
