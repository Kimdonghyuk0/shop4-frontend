import React, { useState, useEffect } from 'react';
import styles from './componentcss/ScrollToTopButton.module.css';
import { FaAngleUp } from 'react-icons/fa';

const ScrollToTopButton = () => {
	const [isVisible, setIsVisible] = useState(false);

	// 스크롤 이벤트 핸들러
	const toggleVisibility = () => {
		if (window.pageYOffset > 300) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	};

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	useEffect(() => {
		window.addEventListener('scroll', toggleVisibility);
		return () => {
			window.removeEventListener('scroll', toggleVisibility);
		};
	}, []);

	return (
		<div className={styles.scroll_to_top}>
			<FaAngleUp
				size={'2px'}
				onClick={scrollToTop}
				className={styles.scroll_to_top_button}
			></FaAngleUp>
		</div>
	);
};

export default ScrollToTopButton;
