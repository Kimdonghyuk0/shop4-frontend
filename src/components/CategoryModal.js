import { useNavigate } from 'react-router-dom';
import styles from './componentcss/CategoryModal.module.css';

function CategoryModal(props) {
	let navigate = useNavigate();

	return (
		<div>
			<div
				className={styles.overlay}
				onMouseOver={() => {
					props.setOpenCategory(!props.openCategory);
				}}
			></div>
			<div
				className={`${styles.category_menu} ${
					props.openCategory ? styles.open : ''
				}`}
			>
				<ul>
					<li
						onClick={() => {
							navigate('goods/shoes');
						}}
					>
						신발
					</li>
					<li
						onClick={() => {
							navigate('goods/hat');
						}}
					>
						모자
					</li>
					<li
						onClick={() => {
							navigate('goods/top');
						}}
					>
						상의
					</li>
					<li
						onClick={() => {
							navigate('goods/bottom');
						}}
					>
						하의
					</li>
				</ul>
			</div>
		</div>
	);
}

export default CategoryModal;
