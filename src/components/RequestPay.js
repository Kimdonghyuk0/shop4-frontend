import axios from "axios";

// OrderDetail 생성 API
const createOrderDetail = async (orderDetail) => {
  console.log("Creating OrderDetail:", orderDetail);
  return axios.post("http://localhost:8080/api/order-details", orderDetail);
};

// Goods 조회 API
const getGoodsById = async (goodsId) => {
  console.log("Fetching Goods by ID:", goodsId);
  return axios.get(`http://localhost:8080/api/goods/${goodsId}`);
};

// 주문 생성 API
const createOrder = async (order) => {
  console.log("Creating Order:", order);
  return axios.post("http://localhost:8080/api/orders", order);
};

// 결제 생성 API
const createPayment = async (payment) => {
  console.log("Creating Payment:", payment);
  return axios.post("http://localhost:8080/api/payments", payment);
};

const clearCartAfterPayment = async (goodsIds) => {
  return axios.post(
    "http://localhost:8080/api/cart/clear-after-payment",
    goodsIds
  );
};

const requestPay = (cartData, receiver, totalPrice) => {
  console.log(totalPrice);
  const { IMP } = window;
  IMP.init("imp43064854");

  return new Promise((resolve, reject) => {
    IMP.request_pay(
      {
        pg: "html5_inicis",
        pay_method: "card",
        merchant_uid: new Date().getTime().toString(),
        name: "테스트 상품",
        amount: 100,
        buyer_name: receiver.name,
        buyer_tel: receiver.phone,
        buyer_email: receiver.email,
        buyer_addr: receiver.address,
        buyer_postcode: "123-456",
      },
      async (rsp) => {
        console.log("Payment Response:", rsp);

        try {
          const { data } = await axios.post(
            `http://localhost:8080/verifyIamport/${rsp.imp_uid}`
          );

          console.log("Verification Response:", data); // 결제 검증 응답

          if (rsp.paid_amount === data.response.amount) {
            // 주문 데이터 생성
            const order = {
              orderUid: rsp.merchant_uid,
              buyerName: receiver.name,
              buyerPhone: receiver.phone,
              buyerAddress: receiver.address,
              buyerPostCode: receiver.postcode || "",
              orderPrice: totalPrice,
              orderStatus: "PENDING",
              orderDate: new Date().toISOString(),
              member: { id: JSON.parse(sessionStorage.getItem("user")).id },
            };
            console.log(order);
            const orderResponse = await createOrder(order);
            const orderId = orderResponse.data.id; // 생성된 주문의 ID

            // 결제 데이터 생성
            const payment = {
              paymentUid: rsp.imp_uid,
              totalPrice: totalPrice,
              discountPrice: 0,
              deliveryFee: 0,
              finalPrice: totalPrice,
              paymentDate: new Date().toISOString(),
              paymentStatus: "COMPLETED",
              paymentMethod: "CARD",
              orderId,
            };
            console.log(payment);
            await createPayment(payment);

            // cartData에서 orderDetail 생성
            for (const item of cartData) {
              // Goods 객체를 DB에서 조회
              const goodsResponse = await getGoodsById(item.goods.id);
              const goods = goodsResponse.data; // 조회된 Goods 객체

              const orderDetail = {
                orderCount: item.quantity, // 상품 수량
                goods: { id: goods.id }, // 조회된 상품 ID
                order: { id: orderId }, // 주문 ID
              };

              await createOrderDetail(orderDetail); // 각 상품에 대해 orderDetail 생성
            }

            // 장바구니 비우기
            const goodsIds = cartData.map((item) => item.goods.id); // goods_id 배열 생성
            console.log("Clearing cart for Goods IDs:", goodsIds);
            await clearCartAfterPayment(goodsIds); // 장바구니 비우기 API 호출
            resolve({
              success: true,
              message: "결제가 성공적으로 완료되었습니다.",
            });
          } else {
            alert("결제 실패1");
            reject({ success: false, message: "결제 검증에 실패했습니다." });
          }
        } catch (error) {
          console.error("Error while verifying payment:", error);
          alert("결제 실패2");
          reject({
            success: false,
            message: "결제 처리 중 오류가 발생했습니다.",
          });
        }
      }
    );
  });
};

export default requestPay;
