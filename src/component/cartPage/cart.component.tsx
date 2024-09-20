import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  Col,
  Container,
  Row,
} from 'reactstrap';
import '../assets/css/aquarium_css/detail.css';

// Helper function to manually decode JWT (if needed)
const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

interface CartItem {
  _id: string;
  fishId: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  };
  quantity: number;
  price: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You need to log in to view your cart.');
        setLoading(false);
        return;
      }

      // Optional decoding logic if you need to extract userId from the token
      const decoded: DecodedToken = decodeToken(token);
      if (decoded) {
        setUserId(decoded.userId); // Set userId state
      } else {
        setError('Invalid token');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/carts/${decoded.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('API Response: ', response.data); // Log the response

        const cartData = response.data;

        // Since the response is already an array, just set the cartItems directly
        if (Array.isArray(cartData)) {
          setCartItems(cartData); // No need to map over items array
        } else {
          setError('Unexpected response format');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveItem = async (itemId: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/carts/item/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(cartItems.filter((item) => item._id !== itemId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:5000/check',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert('Checkout successful!');
        setCartItems([]);
      } else {
        alert('Checkout failed. Please try again.');
      }
    } catch (err) {
      alert('Failed to complete checkout. Please try again.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat('de-DE').format(number);
  };

  return (
    <section className="h-100 h-custom" style={{ backgroundColor: '#eee' }}>
      <Container className="py-5 h-100">
        <Row className="justify-content-center align-items-center h-100">
          <Col>
            <Card>
              <CardBody className="p-4">
                <Row>
                  <Col lg="7">
                    <h5>
                      <a className="text-body">
                        <i className="fas fa-long-arrow-alt-left me-2" />{' '}
                        Continue shopping
                      </a>
                    </h5>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <p className="mb-1">Shopping cart</p>
                        <p className="mb-0">
                          You have {cartItems.length} items in your cart
                        </p>
                      </div>
                    </div>

                    {cartItems.map((item, index) => (
                      <Card className="mb-3" key={index}>
                        <CardBody>
                          <div className="d-flex justify-content-between">
                            <div className="d-flex flex-row align-items-center">
                              <div>
                                <CardImg
                                  src={
                                    item.fishId?.image ||
                                    '/path/to/default/image.jpg'
                                  }
                                  className="rounded-3"
                                  style={{
                                    width: '80px',
                                    paddingRight: '1rem',
                                  }}
                                  alt="Shopping item"
                                />
                              </div>
                              <div
                                className="ms-3 mb-0"
                                style={{
                                  width: '80px',
                                  paddingLeft: '.5rem',
                                  paddingTop: '.7rem',
                                }}
                              >
                                <h5>{item.fishId.name}</h5>
                              </div>
                              <div className="col-8">
                                <p className="small mb-0">
                                  {item.fishId.description}
                                </p>
                              </div>
                            </div>
                            <div className="d-flex flex-row align-items-center">
                              <div style={{ width: '50px' }}>
                                <h5 className="fw-normal mb-0">
                                  {item.quantity}
                                </h5>
                              </div>
                              <div style={{ width: '80px' }}>
                                <h3 className="mb-0">
                                  {formatNumber(item.fishId.price)} VNĐ
                                </h3>
                              </div>
                              <a
                                onClick={() => handleRemoveItem(item._id)}
                                style={{ color: '#cecece' }}
                              >
                                <i className="fas fa-trash-alt" />
                              </a>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </Col>

                  <Col lg="5">
                    <Card className="bg-info text-white rounded-3">
                      <CardBody>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <h5 className="mb-0">Card details</h5>
                          <CardImg
                            src={require('../assets/img/aquarium/Logo.png')}
                            className="rounded-3"
                            style={{ width: '45px' }}
                            alt="Avatar"
                          />
                        </div>

                        <hr />

                        <div className="d-flex justify-content-between">
                          <p className="mb-2">Subtotal</p>
                          <p className="mb-2">
                            {formatNumber(calculateTotal())} VNĐ
                          </p>
                        </div>

                        <div className="d-flex justify-content-between">
                          <p className="mb-2">Shipping</p>
                          <p className="mb-2">20.000 VNĐ</p>
                        </div>

                        <div className="d-flex justify-content-between">
                          <p className="mb-2">Total (Incl. taxes)</p>
                          <p className="mb-2">
                            {formatNumber(calculateTotal() + 20000)} VNĐ
                          </p>
                        </div>

                        <Button
                          color="primary"
                          block
                          size="lg"
                          onClick={handleCheckout}
                        >
                          <div className="d-flex justify-content-between">
                            <span>
                              {formatNumber(calculateTotal() + 20000)} VNĐ
                            </span>
                            <span>
                              Checkout{' '}
                              <i className="fas fa-long-arrow-alt-right ms-2" />
                            </span>
                          </div>
                        </Button>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CartPage;
