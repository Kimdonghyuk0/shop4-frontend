import { useEffect, useState } from 'react';
import { deleteMember, listMembers } from '../../services/MemberService';
import styles from './admincss/Admin.module.css';

function UserManagement() {
	let [users, setUsers] = useState([]);

	useEffect(() => {
		listMembers().then((response) => {
			setUsers(response.data);
		});
		console.log(users);
	}, []);

	return (
		<div>
			<h2 style={{ margin: '15px' }}>Shop4 Members</h2>
			<table className={styles.admin_table}>
				<thead>
					<th>이름</th>
					<th>주소</th>
					<th>번호</th>
					<th>관리</th>
				</thead>
				<tbody>
					{users.map((member) => {
						return (
							<tr>
								<td>{member.name}</td>
								<td>{member.address}</td>
								<td>{member.phone}</td>
								<td>
									<button className="btn btn-primary" onClick={() => {}}>
										{' '}
										관리
									</button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

export default UserManagement;
