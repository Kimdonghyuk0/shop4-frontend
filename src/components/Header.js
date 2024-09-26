import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { searchInfo } from '../store/searchSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setIsNotAdmin } from '../store/adminSlice';
import { requestedListFriends } from '../services/FriendService';
import { setRequestedFriends } from '../store/requestedFriendsSlice'; // 액션 가져오기

import './../App.css';

import { IoLogInOutline, IoLogOutOutline } from 'react-icons/io5';
import { PiFinnTheHumanBold } from 'react-icons/pi';
import { BsClockHistory } from 'react-icons/bs';
import { FiShoppingCart } from 'react-icons/fi';
import { CiSearch } from 'react-icons/ci';
import { MdStoreMallDirectory } from 'react-icons/md';
import { GiHamburgerMenu } from 'react-icons/gi';
import { PiChatCircleBold } from 'react-icons/pi';
import CategoryModal from './CategoryModal';

const Header = () => {
  const requestedFriends = useSelector(
    (state) => state.friendRequests.requestedFriends
  );
  let friendRequestsCount = requestedFriends.length;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로를 가져오기 위한 useLocation 훅
  const handleNavigation = (path) => {
    navigate(path);
  };
  const user = JSON.parse(sessionStorage?.getItem('user')); // 세션에서 사용자 이름 가져오기
  const userAlert = sessionStorage.getItem('user');
  const memberId = JSON.parse(userAlert)?.id;
  const isLoggedIn = sessionStorage.getItem('isLoggedIn'); // 로그인 여부 확인
  let [openCategory, setOpenCategory] = useState(false);

  //친구요청 알림 세팅
  useEffect(() => {
    if (memberId) {
      getRequestedFriendsData(memberId);
    }
  }, [memberId]);

  // 친구 요청 목록 가져오는 함수
  function getRequestedFriendsData(memberId) {
    requestedListFriends(memberId)
      .then((response) => {
        dispatch(setRequestedFriends(response.data));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleLogout = () => {
    // 로그아웃 처리 로직 예시
    sessionStorage.removeItem('isLoggedIn'); // 로그인 상태 제거
    sessionStorage.removeItem('user'); // 사용자 정보 제거
    // 관리자 정보(adminSlice)삭제
    dispatch(setIsNotAdmin());
    // 로그아웃 후 페이지 리다이렉션
    navigate('/');
  };

  const handleLogin = () => {
    // 로그인 페이지로 이동하는 로직
    navigate('/login');
  };

  const [search, setSearch] = useState('');

  useEffect(() => {
    if (location.pathname === '/') {
      // Home 화면에서만 searchInfo 호출
      dispatch(searchInfo(search));
    }
  }, [search, location.pathname]); // location.pathname을 의존성 배열에 추가

  const onChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="App">
      <Navbar
        style={{
          background: 'white',
          borderBottom: '1px solid #D8D8D8',
        }}
      >
        <GiHamburgerMenu
          className="ms-4"
          style={{ width: '30px', height: '30px', cursor: 'pointer' }}
          onClick={() => {
            setOpenCategory(!openCategory);
          }}
        />
        {openCategory ? (
          <CategoryModal
            openCategory={openCategory}
            setOpenCategory={setOpenCategory}
          ></CategoryModal>
        ) : (
          ''
        )}

        <Container>
          <Navbar.Brand
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer', fontSize: '30px' }}
          >
            <MdStoreMallDirectory /> Shop4
          </Navbar.Brand>
          <Nav className="me-auto"></Nav>
          <CiSearch style={{ width: '30px', height: '30px' }} />
          <input
            type="text"
            value={search}
            onChange={onChange}
            placeholder="Search..."
            className="search-input me-auto"
            disabled={location.pathname !== '/'} // Home 화면이 아닐 때 비활성화
          />

          <Nav className="me-auto">
            {isLoggedIn ? (
              <Nav.Item
                className="me-2 btn"
                onClick={handleLogout}
                style={{ cursor: 'pointer' }}
              >
                <IoLogOutOutline
                  style={{
                    height: '30px',
                    width: '30px',
                  }}
                />
                <br />
                로그아웃
              </Nav.Item>
            ) : (
              <Nav.Item
                className="me-2 btn"
                onClick={handleLogin}
                style={{ cursor: 'pointer' }}
              >
                <IoLogInOutline
                  style={{
                    height: '30px',
                    width: '30px',
                  }}
                />
                <br />
                로그인
              </Nav.Item>
            )}
            <Nav.Item
              className="me-3 btn"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                handleNavigation('/mypage');
              }}
            >
              <div
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  textAlign: 'center',
                }}
              >
                <PiFinnTheHumanBold style={{ height: '30px', width: '30px' }} />
                {isLoggedIn && friendRequestsCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-10px',
                      backgroundColor: 'red',
                      color: 'white',
                      borderRadius: '50%', // 이미 원형이지만, 패딩과 크기 조정으로 더 동그랗게
                      padding: '5px 4px', // 패딩을 늘려서 배지를 더 크게
                      fontSize: '12px',
                      minWidth: '20px', // 최소 너비 설정으로 배지가 너무 작아 보이지 않도록
                      height: '20px', // 높이 설정으로 더 정확한 원형 유지
                      display: 'flex', // 내용을 중앙에 위치시키기
                      alignItems: 'center', // 수직 중앙 정렬
                      justifyContent: 'center', // 수평 중앙 정렬
                    }}
                  >
                    {friendRequestsCount}
                  </span>
                )}
                <br />
                마이페이지
              </div>
            </Nav.Item>
            <Nav.Item
              className="me-3 btn"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                handleNavigation('/recentlyViewed');
              }}
            >
              <BsClockHistory style={{ height: '30px', width: '30px' }} />
              <br />
              최근본상품
            </Nav.Item>
            <Nav.Item
              className="me-3 btn"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                isLoggedIn ? handleNavigation('/cart') : handleLogin();
              }}
            >
              <FiShoppingCart style={{ height: '30px', width: '30px' }} />
              <br />
              장바구니
            </Nav.Item>
            <Nav.Item
              className="me-3 btn"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                isLoggedIn ? handleNavigation('/chatList') : handleLogin();
              }}
            >
              <PiChatCircleBold style={{ height: '30px', width: '30px' }} />
              <br />
              채팅
            </Nav.Item>
            <Nav.Item
              className="me-3 btn"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                isLoggedIn
                  ? handleNavigation('/couponRoulette')
                  : handleLogin();
              }}
            >
              <br />
              쿠폰룰렛
            </Nav.Item>
          </Nav>
          <h2 style={{ color: 'black', marginTop: 'auto' }}>
            {isLoggedIn ? <div>{user.name + '님'}</div> : <div>Guest</div>}
          </h2>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
