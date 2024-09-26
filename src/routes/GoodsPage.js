import { useEffect, useState } from 'react';
import { getGoodsByCategory } from '../services/GoodsService';
import { useParams } from 'react-router-dom';
import ProductTable from '../components/ProductTable';

function GoodsPage() {
  let [goods, setGoods] = useState([]);
  const { category } = useParams();

  useEffect(() => {
    const getCategory = async () => {
      if (category) {
        const response = await getGoodsByCategory(category);
        setGoods(response.data);
      }
    };

    getCategory();
    console.log(goods);
  }, [category]);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ProductTable goods={goods}></ProductTable>
    </div>
  );
}

export default GoodsPage;
