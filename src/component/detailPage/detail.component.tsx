import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Button, Modal, ModalBody } from 'reactstrap';
import '../assets/css/aquarium_css/detail.css';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

const ProductDetail: React.FC = () => {
  const { _id } = useParams<{ _id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [modal, setModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');

  const isFish = window.location.pathname.includes('/fish');
  const productType = isFish ? 'Fish' : 'Item'; 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const url = isFish
          ? `http://localhost:5000/fishs/${_id}`
          : `http://localhost:5000/items/${_id}`;
        const response = await axios.get(url);
        const productData = response.data;
        setProduct(productData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [_id, isFish]);

  const addToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setModalMessage('You need to log in to add items to the cart.');
      setModal(true);
      return;
    }
  
    console.log('Token:', token); // Log the token to check if it is available
    console.log('Product ID:', _id); // Log the product ID
  
    try {
      const response = await axios.post(
        'http://localhost:5000/carts/cart',
        {
          productId: _id,  // Check if _id is correct
          quantity: 1,
          productType
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Add to Cart Response:', response.data); // Log the server response
      setModalMessage('Product added to cart successfully!');
    } catch (error) {
      console.error('Add to Cart Error:', error); // Log any error from the request
      setModalMessage('Failed to add product. Please try again.');
    } finally {
      setModal(true);
    }
  };  

  const closeModal = () => {
    setModal(false);
  };

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat('de-DE').format(number);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Container fluid className="product-detail">
      {product && (
        <Row>
          <Col md="6" className="main-image">
            {/* Replaced Carousel with simple img */}
            <img
              src={require(`../assets/img/aquarium/${product.image}`)} // Default image if none is available
              alt={product.name}
              className="d-block w-100"
            />
          </Col>
          <Col md="6" className="details">
            <h1>{product.name}</h1>
            <div className="price">{formatNumber(product.price)} VNĐ</div>
            <blockquote>
              <p className="blockquote blockquote-info">
                "{product.description}"
              </p>
            </blockquote>
            <Button className="btn-round" color="info" type="button" onClick={addToCart}>
              <i className="now-ui-icons ui-2_favourite-28"></i>
              Add to Cart
            </Button>
          </Col>
        </Row>
      )}
      <Modal modalClassName="modal-mini modal-info" toggle={closeModal} isOpen={modal}>
        <div className="modal-header justify-content-center">
          <div className="modal-profile">
            <i className="now-ui-icons users_circle-08"></i>
          </div>
        </div>
        <ModalBody>
          <p>{modalMessage}</p>
        </ModalBody>
        <div className="modal-footer">
          <Button className="btn-neutral" color="link" onClick={closeModal}>
            Close
          </Button>
        </div>
      </Modal>
    </Container>
  );
};

export default ProductDetail;
