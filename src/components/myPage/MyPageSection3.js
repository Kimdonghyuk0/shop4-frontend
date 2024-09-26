import ChangeUserPhone from './ChangeUserPhone.js';
import ChangeUserName from './ChangeUserName.js';
// 개인 정보 컴포넌트
function MyPageSection3({ user }) {
	return (
		<>
			<div className="myPageSection3">
				<h5 style={{ fontWeight: 'bold' }}>개인 정보</h5>

				<ChangeUserName user={user} />

				<ChangeUserPhone user={user} />
			</div>
		</>
	);
}

export default MyPageSection3;
