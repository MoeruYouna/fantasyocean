import React, { useState, FormEvent } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Form,
  Input,
  Modal,
  ModalBody,
  Container,
  Row,
  Col,
  Label,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface FormData {
  name: string;
  categoryName: string; // This will hold the category name as expected by the backend
  image: string;
  description: string;
  price: string;
  quantity: string;
}

// Hardcoded item categories
const itemCategories = ["Stone", "Tree", "Led", "Tank"];

const InsertItem: React.FC = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    categoryName: itemCategories[0], // Default to the first category
    image: '',
    description: '',
    price: '',
    quantity: '',
  });
  const [selectedCategory, setSelectedCategory] = useState<string>(itemCategories[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Handle category selection (like in InsertFish)
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setFormData({
      ...formData,
      categoryName: category, // Set the categoryName in formData
    });
  };

  // Handle other form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:5000/items', formData);
      console.log('Response from server:', response.data);
      setModalMessage('Item inserted successfully!');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Insert error:', error.response.data);
        setModalMessage(error.response.data.message || 'Failed to insert item. Please try again.');
      } else {
        console.error('Insert error:', error);
        setModalMessage('Failed to insert item. Please try again.');
      }
    } finally {
      setModal(true);
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModal(false);
  };

  return (
    <div className="section section-signup" style={{ minHeight: '700px' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md="8">
            <Card className="shadow-lg">
              <Form onSubmit={handleSubmit} className="form">
                <CardHeader className="text-center" style={{ backgroundColor: 'rgb(55, 162, 245)', color: '#fff' }}>
                  <CardTitle className="title-up" tag="h3">Add New Item</CardTitle>
                </CardHeader>
                <CardBody>
                  {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                      {errorMessage}
                    </div>
                  )}

                  {/* Category Selection */}
                  <Row className="mb-3">
                    <Col xs="4">
                      <Label>Item Categories</Label>
                    </Col>
                    <Col xs="8">
                      <ListGroup>
                        {itemCategories.map((category, index) => (
                          <ListGroupItem
                            key={index}
                            active={selectedCategory === category}
                            onClick={() => handleCategoryClick(category)}
                            style={{ cursor: 'pointer' }}
                          >
                            {category}
                          </ListGroupItem>
                        ))}
                      </ListGroup>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col xs="4">
                      <Label for="name">Name</Label>
                    </Col>
                    <Col xs="8">
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col xs="4">
                      <Label for="image">Image</Label>
                    </Col>
                    <Col xs="8">
                      <Input
                        type="text"
                        name="image"
                        id="image"
                        value={formData.image}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col xs="4">
                      <Label for="description">Description</Label>
                    </Col>
                    <Col xs="8">
                      <Input
                        type="text"
                        name="description"
                        id="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col xs="4">
                      <Label for="price">Price</Label>
                    </Col>
                    <Col xs="8">
                      <Input
                        type="number"
                        name="price"
                        id="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col xs="4">
                      <Label for="quantity">Quantity</Label>
                    </Col>
                    <Col xs="8">
                      <Input
                        type="number"
                        name="quantity"
                        id="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                  </Row>
                </CardBody>

                <CardFooter className="text-center">
                  <Button className="btn-neutral btn-round" color="info" type="submit" size="lg" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Item'}
                  </Button>
                  <Link to="/admin/insertF">
                    <Button className="btn-neutral btn-round" color="primary" size="lg">
                      Go to Insert Fish
                    </Button>
                  </Link>
                </CardFooter>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>

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
    </div>
  );
};

export default InsertItem;
