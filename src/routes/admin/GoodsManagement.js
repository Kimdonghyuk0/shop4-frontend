import { useEffect, useState } from 'react';
import { listGoods } from '../../services/GoodsService';
import styles from './admincss/Admin.module.css';
import { useNavigate } from 'react-router-dom';

function GoodsManagement() {
	let [goods, setGoods] = useState([]);

	let navigate = useNavigate();

	useEffect(() => {
		listGoods().then((response) => {
			setGoods(response.data);
		});

		console.log(goods);
	}, []);

	return (
		<div>
			<h2 style={{ margin: '15px' }}>Shop4 Goods</h2>
			<table className={styles.admin_table}>
				<thead>
					<th>이름</th>
					<th>재고</th>
					<th>가격</th>
					<th>관리</th>
				</thead>
				<tbody>
					{goods.map((item) => {
						return (
							<tr>
								<td>{item.name}</td>
								<td>{item.stock}</td>
								<td>{item.price}</td>
								<td>
									<button
										className="btn btn-primary"
										onClick={() => {
											navigate('/admin/updategoods', { state: item.id });
										}}
									>
										관리
									</button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<div style={{ textAlign: 'center' }}>
				<button
					className="btn btn-primary"
					style={{
						width: '150px',
					}}
					onClick={() => {
						navigate('/admin/addgoods');
					}}
				>
					상품추가
				</button>
			</div>
		</div>
	);
}

export default GoodsManagement;
