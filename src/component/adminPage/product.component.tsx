import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
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
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
} from 'reactstrap';

interface FormData {
  name: string;
  category: string;
  image: string;
  description: string;
  price: string;
}

const InsertPage: React.FC = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    image: '',
    description: '',
    price: '',
  });
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/fishs', formData);
      console.log(response.data);
      setModalMessage('Insert successfully!');
    } catch (error) {
      setModalMessage('Failed to insert. Please try again.');
      setErrorMessage('Invalid input Data');
    } finally {
      setModal(true);
    }
  };

  const closeModal = () => {
    setModal(false);
    if (modalMessage === 'Account created successfully!') {
      console.log('success');
    }
  };

  return (
    <div
      className="section section-signup"
      style={{
        minHeight: '700px',
      }}
    >
      <Container>
        <Row>
          <Card className="card-signup" data-background-color="blue">
            <Form onSubmit={handleSubmit} className="form">
              <CardHeader className="text-center">
                <CardTitle className="title-up" tag="h3">
                  Insert
                </CardTitle>
              </CardHeader>
              <CardBody>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="now-ui-icons ui-1_email-85"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Name. . ."
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="now-ui-icons users_circle-08"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Category. . ."
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="now-ui-icons ui-1_lock-circle-open"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Image. . ."
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="now-ui-icons ui-1_lock-circle-open"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Description. . ."
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="now-ui-icons ui-1_lock-circle-open"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Price. . ."
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </InputGroup>
              </CardBody>
              <CardFooter className="text-center">
                <Button
                  className="btn-neutral btn-round"
                  color="info"
                  type="submit"
                  size="lg"
                >
                  Add New Fish
                </Button>
              </CardFooter>
            </Form>
          </Card>
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

export default InsertPage;
