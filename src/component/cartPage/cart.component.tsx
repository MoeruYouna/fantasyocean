import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  Col,
  Container,
  Input,
  Row,
  Form,
  FormGroup,
  Label,
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
      try {
        const response = await axios.get('http://localhost:5000/carts/664d422b63ee97ae2888b892');
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
    try {
      await axios.delete(`http://localhost:5000/carts/664d422b63ee97ae2888b892/item/${itemId}`);
      setCartItems(cartItems.filter((item) => item._id !== itemId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      // Create a new cart in the database
      const newCartResponse = await axios.post('http://localhost:5000/carts', { accID: '664d422b63ee97ae2888b892' });
      const newCartId = newCartResponse.data._id;

      // Add current items to the new cart
      await Promise.all(
        cartItems.map((item) =>
          axios.post(`http://localhost:5000/cartItems`, {
            cartID: newCartId,
            fishID: item.fishID._id,
            quantity: item.quantity,
          })
        )
      );

      // Optionally clear the current cart or update the UI
      setCartItems([]);
      alert('Checkout successful! A new cart has been created.');
    } catch (err: any) {
      setError('Failed to complete checkout. Please try again.');
    } finally {
      setLoading(false);
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

  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + '... read more';
    }
    return description;
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
                      <div>
                        <p>
                          <span className="text-muted">Sort by:</span>
                          <a className="text-body">
                            price
                            <i className="fas fa-angle-down mt-1" />
                          </a>
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
                                  {truncateDescription(item.fishID.description, 50)}
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

                        <p className="small">Card type</p>
                        <a className="text-white">
                          <i className="fab fa-cc-mastercard fa-3x me-2" />
                        </a>
                        <a className="text-white">
                          <i className="fab fa-cc-visa fa-3x me-2" />
                        </a>
                        <a className="text-white">
                          <i className="fab fa-cc-paypal fa-3x me-2" />
                        </a>

                        <Form className="mt-4">
                          <FormGroup>
                            <Label for="cardName" className="form-label">
                              Cardholder's Name
                            </Label>
                            <Input
                              id="cardName"
                              type="text"
                              placeholder="Cardholder's Name"
                              className="form-control-lg"
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label for="cardNumber" className="form-label">
                              Card Number
                            </Label>
                            <Input
                              id="cardNumber"
                              type="text"
                              placeholder="1234 5678 9012 3457"
                              className="form-control-lg"
                              minLength={19}
                              maxLength={19}
                            />
                          </FormGroup>
                          <Row className="mb-4">
                            <Col md="6">
                              <FormGroup>
                                <Label for="cardExpiration" className="form-label">
                                  Expiration
                                </Label>
                                <Input
                                  id="cardExpiration"
                                  type="text"
                                  placeholder="MM/YYYY"
                                  className="form-control-lg"
                                  minLength={7}
                                  maxLength={7}
                                />
                              </FormGroup>
                            </Col>
                            <Col md="6">
                              <FormGroup>
                                <Label for="cardCvv" className="form-label">
                                  Cvv
                                </Label>
                                <Input
                                  id="cardCvv"
                                  type="text"
                                  placeholder="&#9679;&#9679;&#9679;"
                                  className="form-control-lg"
                                  minLength={3}
                                  maxLength={3}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </Form>

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
