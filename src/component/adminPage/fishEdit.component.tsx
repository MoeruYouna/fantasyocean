import React, { useState, useEffect, FormEvent } from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter, CardTitle, Form, Input, Modal, ModalBody, Container, Row, Col, Label, ListGroup, ListGroupItem } from 'reactstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// Hardcoded fish categories
const fishCategories = ["Fish", "Turtle", "Crab", "Lobster"];

interface FormData {
  name: string;
  categoryName: string; // This will hold the category name as expected by the backend
  image: string;
  description: string;
  price: string;
  quantity: string;
}

const EditFish: React.FC = () => {
  // No need to specify a type for useParams
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();  // useNavigate instead of useHistory
  
  const [modal, setModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    categoryName: fishCategories[0],
    image: '',
    description: '',
    price: '',
    quantity: '',
  });
  const [selectedCategory, setSelectedCategory] = useState<string>(fishCategories[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `http://localhost:5000/fishs/${id}`;
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
        console.error('Error fetching product data:', error);
        setErrorMessage('Failed to fetch product data.');
      }
    };

    fetchData();
  }, [id]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setFormData({
      ...formData,
      categoryName: category,
    });
  };

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
      const url = `http://localhost:5000/fishs/${id}`;
      await axios.put(url, formData);
      setModalMessage('Fish updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      setModalMessage('Failed to update fish. Please try again.');
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
                  <CardTitle className="title-up" tag="h3">Edit Fish</CardTitle>
                </CardHeader>
                <CardBody>
                  {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}

                  {/* Category Selection */}
                  <Row className="mb-3">
                    <Col xs="4">
                      <Label>Fish Categories</Label>
                    </Col>
                    <Col xs="8">
                      <ListGroup>
                        {fishCategories.map((category, index) => (
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
                    {loading ? 'Updating...' : 'Update Fish'}
                  </Button>
                </CardFooter>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal for success/failure messages */}
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

export default EditFish;
