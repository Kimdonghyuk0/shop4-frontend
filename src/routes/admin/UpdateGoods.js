import styles from './admincss/AddGoods.module.css';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	createGoods,
	getGoods,
	updateGoods,
} from '../../services/GoodsService';

function UpdateGoods() {
	const location = useLocation();
	let id = location.state;
	let [item, setItem] = useState([]);

	let [name, setName] = useState('');
	let [price, setPrice] = useState('');
	let [description, setDescription] = useState('');
	let [stock, setStock] = useState('');
	let [url, setUrl] = useState('');
	let [category, setCategory] = useState('');

	let [toast, setToast] = useState(false);
	let navigate = useNavigate();

	useEffect(() => {
		const setGoods = async () => {
			await getGoods(id).then((response) => {
				setItem(response.data);
				setName(response.data.name);
				setPrice(response.data.price);
				setDescription(response.data.description);
				setStock(response.data.stock);
				setCategory(response.data.category);
				setUrl(response.data.url);
			});
		};

		setGoods();
		console.log(item);
	}, [id]);

	function validateAndSubmit() {
		if (
			name === '' ||
			price === '' ||
			stock === '' ||
			description === '' ||
			category === ''
		) {
			setToast(true);
		} else {
			let newItem = {
				name: name,
				price: price,
				stock: stock,
				description: description,
				category: category,
				url: url,
			};

			console.log(newItem);

			updateGoods(id, newItem);
			navigate(-1);
		}
	}

	return (
		<div className={styles.addGoodsContainer}>
			<br />
			<br />
			<h2 className={styles.header}>상품 추가 페이지</h2>
			<table className={styles.table}>
				<tbody>
					<tr>
						<td>상품명</td>
						<td>
							<input
								type="text"
								onChange={(e) => setName(e.target.value)}
								on
								defaultValue={item.name}
							/>
						</td>
					</tr>
					<tr>
						<td>가격</td>
						<td>
							<input
								type="text"
								onChange={(e) => setPrice(e.target.value)}
								defaultValue={item.price}
							/>
						</td>
					</tr>
					<tr>
						<td>상품 설명</td>
						<td>
							<input
								type="text"
								onChange={(e) => setDescription(e.target.value)}
								defaultValue={item.description}
							/>
						</td>
					</tr>
					<tr>
						<td>재고수</td>
						<td>
							<input
								type="text"
								onChange={(e) => setStock(e.target.value)}
								defaultValue={item.stock}
							/>
						</td>
					</tr>
					<tr>
						<td>상품 이미지</td>
						<td>
							<input
								type="file"
								className={styles.fileInput}
								onChange={(e) => {}}
								defaultValue={item.url}
							/>
						</td>
					</tr>
					<tr>
						<td>카테고리</td>
						<td>
							<select
								onChange={(e) => setCategory(e.target.value)}
								defaultValue={item.category}
							>
								<option value={'shoes'}>신발</option>
								<option value={'top'}>상의</option>
								<option value={'bottom'}>하의</option>
								<option value={'hat'}>모자</option>
							</select>
						</td>
					</tr>
				</tbody>
			</table>
			<div className={styles.buttonContainer}>
				<button
					className={styles.addButton}
					onClick={(e) => {
						console.log();
						validateAndSubmit();
					}}
				>
					갱신하다
				</button>
				<button className={styles.cancelButton} onClick={() => navigate('/')}>
					돌아가다
				</button>
				<button
					className={`btn btn-danger ${styles.deleteButton}`}
					//onClick={() => navigate('/')}
				>
					삭제하다
				</button>
			</div>
			<ToastContainer className={styles.toastContainer} position="bottom-end">
				<Toast
					bg="danger"
					onClose={() => setToast(false)}
					show={toast}
					delay={3000}
					autohide
				>
					<Toast.Header>
						<strong className="me-auto">경고</strong>
					</Toast.Header>
					<Toast.Body className={styles.toastBody}>
						모든 필드를 입력해주세요.
					</Toast.Body>
				</Toast>
			</ToastContainer>
			{url && <img src={url} alt="Preview" className={styles.imgPreview} />}
		</div>
	);
}

export default UpdateGoods;
