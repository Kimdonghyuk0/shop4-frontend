import { Wheel } from "react-custom-roulette"; // 룰렛 import
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listCoupons } from "../services/CouponService";
import { distributeCoupon } from "../services/UserCouponService";
import styles from "./css/CouponRoulette.module.css"; // 스타일을 위한 CSS 파일 import

function CouponRoulette() {
  const userSession = JSON.parse(sessionStorage.getItem("user")); // 세션에서 사용자 정보 가져오기
  let navigate = useNavigate();

  // 쿠폰 상태 관리
  const [coupon, setCoupon] = useState([]);
  const [data, setData] = useState([]); // 룰렛에 사용할 데이터
  const [mustSpin, setMustSpin] = useState(false); // 룰렛 회전 여부
  const [prizeNumber, setPrizeNumber] = useState(null); // 당첨 인덱스
  const [isCoupon, setIsCoupon] = useState(false);
  const [loading, setLoading] = useState(true); // 로딩 상태

  // 쿠폰 목록 가져오기
  const getAllCoupon = async () => {
    setLoading(true);
    try {
      const res = await listCoupons();
      const couponList = res.data;

      // 유효한 쿠폰 필터링
      const validCoupons = couponList.filter((item) => item.count > 0);
      if (validCoupons.length === 0) {
        setIsCoupon(false);
        alert("사용 가능한 쿠폰이 없습니다.");
        setLoading(false);
        return;
      }
      setCoupon(validCoupons);

      const totalWeight = validCoupons.reduce((acc, item) => {
        return acc + (item.discount >= 50 ? 10 : item.discount >= 30 ? 25 : 35);
      }, 0);

      // 룰렛 데이터 설정
      const rouletteData = validCoupons.map((item, idx) => {
        let percentage;
        if (item.discount >= 50) {
          percentage = (10 / totalWeight) * 100;
        } else if (item.discount >= 30) {
          percentage = (25 / totalWeight) * 100;
        } else {
          percentage = (35 / totalWeight) * 100;
        }

        const colors = [
          "#FFCDD2",
          "#F8BBD0",
          "#E1BEE7",
          "#D1C4E9",
          "#C5CAE9",
          "#BBDEFB",
          "#B3E5FC",
          "#B2EBF2",
          "#B2DFDB",
          "#C8E6C9",
          "#DCEDC8",
          "#F0F4C3",
          "#FFF9C4",
          "#FFECB3",
          "#FFE0B2",
          "#FFCCBC",
          "#D7CCC8",
          "#CFD8DC",
        ];

        return {
          option: item.name,
          style: {
            backgroundColor: colors[idx % colors.length],
            textColor: "#000",
          },
          percentage: percentage,
        };
      });

      setData(rouletteData);
      setIsCoupon(true);
    } catch (error) {
      console.error("쿠폰 목록을 가져오는 데 실패했습니다:", error);
      alert("쿠폰 목록을 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCoupon(); // 컴포넌트 마운트 시 쿠폰 데이터 가져오기
  }, []);

  // 룰렛 회전 클릭 이벤트 처리
  const handleSpinClick = () => {
    if (!mustSpin && data.length > 0) {
      const pivot = Math.random() * 100;
      let stack = 0;
      let newPrizeNumber = null;

      data.some((row, idx) => {
        stack += row.percentage;
        if (pivot <= stack) {
          newPrizeNumber = idx;
          return true;
        }
      });

      if (newPrizeNumber !== null) {
        setPrizeNumber(newPrizeNumber);
        setMustSpin(true);
      } else {
        alert("다시 시도하십시오.");
        navigate("/couponRoulette");
      }
    }
  };

  // 룰렛이 멈출 때 호출되는 함수
  const StopSpinning = () => {
    setMustSpin(false);
    distributeUserCoupon();
    if (prizeNumber !== null && prizeNumber >= 0 && coupon[prizeNumber]) {
      alert(coupon[prizeNumber].name + "이 당첨되셨습니다");
      navigate("/myCoupons");
    } else {
      console.error("유효하지 않은 prizeNumber:", prizeNumber);
    }
  };

  // 사용자에게 쿠폰 배포
  const distributeUserCoupon = async () => {
    if (prizeNumber !== null && coupon[prizeNumber]) {
      try {
        await distributeCoupon(userSession.id, coupon[prizeNumber].id);
      } catch (error) {
        console.error("쿠폰 배포에 실패했습니다:", error);
        alert("쿠폰 배포에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className={styles.rouletteContainer}>
      {loading ? (
        <div>로딩 중...</div>
      ) : isCoupon ? (
        <div className={styles.wheelContainer}>
          <Wheel
            spinDuration={0.4}
            startingOptionIndex={Math.floor(Math.random() * data.length)}
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={data}
            onStopSpinning={StopSpinning}
          />
          <button className={styles.spinButton} onClick={handleSpinClick}>
            돌리기
          </button>
        </div>
      ) : (
        <div>사용 가능한 쿠폰이 없습니다.</div>
      )}
    </div>
  );
}

export default CouponRoulette;
