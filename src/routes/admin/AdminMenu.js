import { Link } from "react-router-dom";
import styles from "./admincss/Admin.module.css";

function AdminMenu() {
  return (
    <div style={{ width: "15%", backgroundColor: "#1e1e1e" }}>
      <h2 style={{ margin: "15px", color: "#BDBDBD" }}>사이트 관리</h2>
      <ul className={styles.admin_ul}>
        <li>
          <Link to="/admin">대시보드</Link>
        </li>
        <li>
          <Link to="/admin/members">유저관리</Link>
        </li>
        <li>
          <Link to="/admin/goods">상품관리</Link>
        </li>
        <li>
          <Link to="/admin/reports">통계</Link>
        </li>
        <li>
          <Link to="/admin/couponManagement">쿠폰관리</Link>
        </li>
      </ul>
    </div>
  );
}

export default AdminMenu;
