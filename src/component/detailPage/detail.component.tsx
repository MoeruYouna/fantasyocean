import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Button,
  Carousel,
  CarouselItem,
  CarouselIndicators,
  Modal,
  ModalBody,
} from 'reactstrap';
import '../assets/css/aquarium_css/detail.css';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

interface CarouselItemType {
  src: string;
  altText: string;
  caption: string;
}

const ProductDetail: React.FC = () => {
  const { _id } = useParams<{ _id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [items, setItems] = useState<CarouselItemType[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');

  const isFish = window.location.pathname.includes('/fish'); // Check if it's a fish or item

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const url = isFish
          ? `http://localhost:5000/fishs/${_id}`
          : `http://localhost:5000/items/${_id}`;
        const response = await axios.get(url);
        const productData = response.data;
        setProduct(productData);

        if (productData.image) {
          setItems([{ src: productData.image, altText: productData.name, caption: productData.name }]);
        }
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

    try {
      await axios.post(
        'http://localhost:5000/carts/cart',
        {
          productID: _id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        }
      );
      setModalMessage('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding product to cart:', error);
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

  const CarouselSection: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [animating, setAnimating] = useState<boolean>(false);

    const onExiting = () => setAnimating(true);
    const onExited = () => setAnimating(false);

    const next = () => {
      if (animating) return;
      const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
      setActiveIndex(nextIndex);
    };

    const previous = () => {
      if (animating) return;
      const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
      setActiveIndex(nextIndex);
    };

    const goToIndex = (newIndex: number) => {
      if (animating) return;
      setActiveIndex(newIndex);
    };

    return (
      <div className="section" id="carousel">
        <Container>
          <Row className="justify-content-center w-100">
            <Col lg="7" md="12">
              <Carousel activeIndex={activeIndex} next={next} previous={previous}>
                <CarouselIndicators
                  items={items.map((item, index) => ({ ...item, key: index }))}
                  activeIndex={activeIndex}
                  onClickHandler={goToIndex}
                />
                {items.map((item, index) => (
                  <CarouselItem onExiting={onExiting} onExited={onExited} key={index}>
                    <img
                      src={require(`../assets/img/aquarium/${item.src}`)}
                      alt={item.altText}
                      className="d-block w-100"
                    />
                    <div className="carousel-caption d-none d-md-block">
                      <h5>{item.caption}</h5>
                    </div>
                  </CarouselItem>
                ))}
                <a
                  className="carousel-control-prev"
                  data-slide="prev"
                  href="#pablo"
                  onClick={(e) => {
                    e.preventDefault();
                    previous();
                  }}
                  role="button"
                >
                  <i className="now-ui-icons arrows-1_minimal-left"></i>
                </a>
                <a
                  className="carousel-control-next"
                  data-slide="next"
                  href="#pablo"
                  onClick={(e) => {
                    e.preventDefault();
                    next();
                  }}
                  role="button"
                >
                  <i className="now-ui-icons arrows-1_minimal-right"></i>
                </a>
              </Carousel>
            </Col>
          </Row>
        </Container>
      </div>
    );
  };

  return (
    <Container fluid className="product-detail">
      {product && (
        <Row>
          <Col md="6" className="main-image">
            <CarouselSection />
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
            <div className="share">
              Share:
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
            </div>
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
