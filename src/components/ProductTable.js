import { useNavigate } from 'react-router-dom';
import styles from './componentcss/ProductTable.module.css';

function ProductTable(props) {
	let navigate = useNavigate();

	return (
		<table className={styles.product_table}>
			<thead>
				<tr>
					<th>이미지</th>
					<th>상품명</th>
					<th>상품 가격</th>
					<th>상품 재고</th>
					<th>상품 설명</th>
				</tr>
			</thead>
			<tbody>
				{props.goods.length > 0 ? (
					props.goods.map((product) => (
						<tr key={product.id}>
							<td>
								<img
									style={{ cursor: 'pointer' }}
									src={product.url}
									onClick={() => {
										navigate(`/detail/${product.id}`);
									}}
								></img>
							</td>
							<td>{product.name}</td>
							<td>{product.price}</td>
							<td>{product.stock}</td>
							<td>{product.description}</td>
						</tr>
					))
				) : (
					<p>No goods found</p>
				)}
			</tbody>
		</table>
	);
}

export default ProductTable;
