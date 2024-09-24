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
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import '../assets/css/aquarium_css/detail.css';

// Helper function to decode JWT
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
  productType: string; // 'Fish' or 'Item'
  productId: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    // Include any other product fields
  };
  quantity: number;
  price: number;
}

const CartPage: React.FC = () => {
  // State declarations
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // New state variables for modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You need to log in to view your cart.');
        setLoading(false);
        return;
      }

      const decoded: DecodedToken = decodeToken(token);
      if (decoded) {
        setUserId(decoded.userId);
      } else {
        setError('Invalid token');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/carts/${decoded.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const cartData = response.data;
        console.log('API Response:', cartData); // Log the response

        // Adjust the condition to handle array response
        if (Array.isArray(cartData)) {
          setCartItems(cartData);
        } else if (cartData && cartData.items) {
          setCartItems(cartData.items);
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

  const handleRemoveItem = (item: CartItem) => {
    setItemToRemove(item);
    setIsModalOpen(true);
  };

  const confirmRemoveItem = async () => {
    if (!itemToRemove) return;

    const token = localStorage.getItem('token');
    if (!userId) {
      setError('User ID is not available');
      setIsModalOpen(false);
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/carts/${userId}/product/${itemToRemove.productId._id}/${itemToRemove.productType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(cartItems.filter((item) => item.productId._id !== itemToRemove.productId._id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsModalOpen(false);
      setItemToRemove(null);
    }
  };

  const cancelRemoveItem = () => {
    setIsModalOpen(false);
    setItemToRemove(null);
  };

  const handleUpdateQuantity = async (
    productId: string,
    productType: string,
    newQuantity: number
  ) => {
    const token = localStorage.getItem('token');
    if (!userId) {
      setError('User ID is not available');
      return;
    }

    if (newQuantity < 1) return;
    try {
      await axios.put(
        `http://localhost:5000/carts/${userId}/product/${productId}/${productType}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId._id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!userId) {
      setError('User ID is not available');
      return;
    }
  
    try {
      // Prepare the data for the bill
      const billData = {
        userId, // Assuming userId is set after decoding the token
        items: cartItems.map((item) => ({
          productId: item.productId._id,
          productType: item.productType,
          quantity: item.quantity,
          price: item.productId.price || item.price, // Ensure you use product price
        })),
        totalPrice: calculateTotal(), // Calculate the total price
      };
  
      // Send the bill data to the backend
      const response = await axios.post(
        'http://localhost:5000/bill',
        billData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 201) {
        alert('Checkout successful! Your order is now in process.');
        setCartItems([]); // Clear the cart after successful checkout
      } else {
        alert('Checkout failed. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Failed to complete checkout. Please try again.');
    }
  };  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.productId?.price || item.price || 0;
      return total + price * item.quantity;
    }, 0);
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
                      <a href="/" className="text-body">
                        <i className="fas fa-long-arrow-alt-left me-2" /> Continue shopping
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

                    {cartItems.map((item) => (
                      <Card className="mb-3" key={item._id}>
                        <CardBody>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex flex-row align-items-center">
                              {item.productId?.image ? (
                                <CardImg
                                  src={require(`../assets/img/aquarium/${item.productId.image}`)}
                                  className="rounded-3"
                                  style={{ width: '80px', paddingRight: '1rem' }}
                                  alt="Shopping item"
                                />
                              ) : (
                                <div
                                  className="no-image"
                                  style={{ width: '80px', paddingRight: '1rem' }}
                                >
                                  No Image Available
                                </div>
                              )}
                              <div
                                className="ms-3 mb-0"
                                style={{
                                  width: '80px',
                                  paddingLeft: '.5rem',
                                  paddingTop: '.7rem',
                                }}
                              >
                                <h5>{item.productId?.name || 'No name available'}</h5>
                              </div>
                              <div className="col-8">
                                <p className="small mb-0">
                                  {item.productId?.description || 'No description available'}
                                </p>
                              </div>
                            </div>
                            <div className="d-flex flex-column align-items-center">
                              <div className="d-flex align-items-center mb-2">
                                <Button
                                  color="secondary"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.productId._id,
                                      item.productType,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={item.quantity <= 1}
                                >
                                  -
                                </Button>
                                <Input
                                  type="text"
                                  value={item.quantity}
                                  readOnly
                                  style={{
                                    width: '50px',
                                    textAlign: 'center',
                                    margin: '0 5px',
                                  }}
                                />
                                <Button
                                  color="secondary"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.productId._id,
                                      item.productType,
                                      item.quantity + 1
                                    )
                                  }
                                >
                                  +
                                </Button>
                              </div>
                              <h5 className="mb-0">
                                {formatNumber(
                                  (item.productId?.price || item.price || 0) * item.quantity
                                )}{' '}
                                VNĐ
                              </h5>
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() => handleRemoveItem(item)}
                                className="mt-2"
                              >
                                Remove
                              </Button>
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
                          <h5 className="mb-0">Order Summary</h5>
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
                          <p className="mb-2">20,000 VNĐ</p>
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
                          disabled={cartItems.length === 0}
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

      {/* Confirmation Modal */}
      <Modal isOpen={isModalOpen} toggle={cancelRemoveItem}>
        <ModalHeader toggle={cancelRemoveItem}>Confirm Removal</ModalHeader>
        <ModalBody>
          Are you sure you want to remove{' '}
          <strong>{itemToRemove?.productId.name}</strong> from your cart?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmRemoveItem}>
            Yes, Remove
          </Button>{' '}
          <Button color="secondary" onClick={cancelRemoveItem}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </section>
  );
};

export default CartPage;
