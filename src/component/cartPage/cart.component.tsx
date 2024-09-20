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

interface CartItem {
  _id: string;
  fishID: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  };
  quantity: number;
  fish?: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  };
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You need to log in to view your cart.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/carts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const itemsWithFishData = await Promise.all(
          response.data.map(async (item: CartItem) => {
            const fishResponse = await axios.get(`http://localhost:5000/fishs/fish/${item.fishID._id}`);
            return { ...item, fish: fishResponse.data };
          })
        );
        setCartItems(itemsWithFishData);
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
        'http://localhost:5000/carts/checkout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Checkout successful!');
      setCartItems([]);
    } catch (err) {
      alert('Failed to complete checkout. Please try again.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.fishID.price * item.quantity, 0);
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
                        <i className="fas fa-long-arrow-alt-left me-2" /> Continue shopping
                      </a>
                    </h5>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <p className="mb-1">Shopping cart</p>
                        <p className="mb-0">You have {cartItems.length} items in your cart</p>
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
                                    item.fishID.image
                                      ? require(`../assets/img/aquarium/${item.fishID.image}`)
                                      : ''
                                  }
                                  className="rounded-3"
                                  style={{ width: '80px', paddingRight: '1rem' }}
                                  alt="Shopping item"
                                />
                              </div>
                              <div
                                className="ms-3 mb-0"
                                style={{ width: '80px', paddingLeft: '.5rem', paddingTop: '.7rem' }}
                              >
                                <h5>{item.fishID.name}</h5>
                              </div>
                              <div className="col-8">
                                <p className="small mb-0">
                                  {item.fishID.description}
                                </p>
                              </div>
                            </div>
                            <div className="d-flex flex-row align-items-center">
                              <div style={{ width: '50px' }}>
                                <h5 className="fw-normal mb-0">{item.quantity}</h5>
                              </div>
                              <div style={{ width: '80px' }}>
                                <h3 className="mb-0">{formatNumber(item.fishID.price)} VNĐ</h3>
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
                          <p className="mb-2">{formatNumber(calculateTotal())} VNĐ</p>
                        </div>

                        <div className="d-flex justify-content-between">
                          <p className="mb-2">Shipping</p>
                          <p className="mb-2">20.000 VNĐ</p>
                        </div>

                        <div className="d-flex justify-content-between">
                          <p className="mb-2">Total (Incl. taxes)</p>
                          <p className="mb-2">{formatNumber(calculateTotal() + 20000)} VNĐ</p>
                        </div>

                        <Button color="primary" block size="lg" onClick={handleCheckout}>
                          <div className="d-flex justify-content-between">
                            <span>{formatNumber(calculateTotal() + 20000)} VNĐ</span>
                            <span>
                              Checkout <i className="fas fa-long-arrow-alt-right ms-2" />
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
