import React, { useState, useEffect, FormEvent } from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter, CardTitle, Form, Input, Modal, ModalBody, Container, Row, Col, Label, ListGroup, ListGroupItem } from 'reactstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// Hardcoded item categories
const itemCategories = ["Stone", "Tree", "Led", "Tank"];

interface FormData {
  name: string;
  categoryName: string;  // This will hold the category name as expected by the backend
  image: string;
  description: string;
  price: string;
  quantity: string;
}

const EditItem: React.FC = () => {
  const { id } = useParams<{ id: string }>();  // Extract 'id' from URL
  const navigate = useNavigate();  // Navigate hook
  
  const [modal, setModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    categoryName: itemCategories[0],  // Default category
    image: '',
    description: '',
    price: '',
    quantity: '',
  });
  const [selectedCategory, setSelectedCategory] = useState<string>(itemCategories[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Fetch the item details for editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `http://localhost:5000/items/${id}`;
        const response = await axios.get(url);
        const data = response.data;

        setFormData({
          name: data.name,
          categoryName: data.category,
          image: data.image,
          description: data.description,
          price: data.price.toString(),
          quantity: data.quantity.toString(),
        });
        setSelectedCategory(data.category);
      } catch (error) {
        console.error('Error fetching item data:', error);
        setErrorMessage('Failed to fetch item data.');
      }
    };

    fetchData();
  }, [id]);

  // Handle category selection
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setFormData({
      ...formData,
      categoryName: category,
    });
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const url = `http://localhost:5000/items/${id}`;
      await axios.put(url, formData);
      setModalMessage('Item updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      setModalMessage('Failed to update item. Please try again.');
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
                  <CardTitle className="title-up" tag="h3">Edit Item</CardTitle>
                </CardHeader>
                <CardBody>
                  {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}

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

                  {/* Input Fields */}
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
                    {loading ? 'Updating...' : 'Update Item'}
                  </Button>
                </CardFooter>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal for Success/Error Message */}
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

export default EditItem;
