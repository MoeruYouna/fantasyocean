import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, CardImg, Container } from 'reactstrap';
import './admin.css';

// Define the type for Fish item
interface Fish {
  _id: string;
  name: string;
  image: string;
  category: string;
  description: string;
  price: number;
}

const AdminPage: React.FC = () => {
  const [fishs, setFishs] = useState<Fish[]>([]);

  useEffect(() => {
    fetchFishs();
  }, []);

  const fetchFishs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/fishs');
      setFishs(response.data);
    } catch (error) {
      console.error('Error fetching fishs:', error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await axios.delete(`http://localhost:5000/fishs/fish/delete/${itemId}`);
      setFishs(fishs.filter((item) => item._id !== itemId));
      window.location.reload();
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  return (
    <Container>
      <div className="fish-list">
        <h2>QUẢN LÝ THÔNG TIN SẢN PHẨM</h2>
        <Button
          className="btn-them btn-round btn-white"
          color="default"
          to="/insert"
          outline
          size="lg"
          tag={Link}
        >
          Thêm Sản Phẩm
        </Button>
        <table>
          <thead>
            <tr>
              <th>Mã Sản Phẩm</th>
              <th>Tên Sản Phẩm</th>
              <th>Ảnh Sản Phẩm</th>
              <th>Hạng Mục</th>
              <th>Giới Thiệu</th>
              <th>Giá Cả</th>
              <th>Xử lý</th>
            </tr>
          </thead>
          <tbody>
            {fishs.map((fish) => (
              <tr key={fish._id}>
                <td>{fish._id}</td>
                <td>{fish.name}</td>
                <td>
                  <CardImg
                    className="product-img"
                    top
                    width="1px"
                    src={require(`../assets/img/aquarium/${fish.image}`)}
                    alt={fish.name}
                  />
                </td>
                <td>{fish.category}</td>
                <td>{fish.description}</td>
                <td>{fish.price}</td>
                <td>
                  <button className="btn-sua">Sửa</button>
                  <button className="btn-xoa" onClick={() => handleRemoveItem(fish._id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
};

export default AdminPage;
