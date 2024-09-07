import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  email: string;
  name: string;
  password: string;
}

const Register: React.FC = () => {
  const [firstFocus, setFirstFocus] = useState<boolean>(false);
  const [lastFocus, setLastFocus] = useState<boolean>(false);
  const [emailFocus, setEmailFocus] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/accounts', formData);
      console.log(response.data);
      setModalMessage('Account created successfully!');
    } catch (error) {
      console.error(error);
      setModalMessage('Failed to create account. Please try again.');
    } finally {
      setModal(true);
    }
  };

  const closeModal = () => {
    setModal(false);
    if (modalMessage === 'Account created successfully!') {
      navigate('/login');
    }
  };

  return (
    <div
      className="section section-signup"
      style={{
        backgroundImage: "url(" + require('../assets/img/bg11.jpg') + ")",
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        minHeight: '700px',
      }}
    >
      <Container>
        <Row>
          <Card className="card-signup" data-background-color="blue">
            <Form onSubmit={handleSubmit} className="form">
              <CardHeader className="text-center">
                <CardTitle className="title-up" tag="h3">
                  Sign Up
                </CardTitle>
                <div className="social-line">
                  <Button
                    className="btn-neutral btn-icon btn-round"
                    color="facebook"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="fab fa-facebook-square"></i>
                  </Button>
                  <Button
                    className="btn-neutral btn-icon btn-round"
                    color="twitter"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="lg"
                  >
                    <i className="fab fa-twitter"></i>
                  </Button>
                  <Button
                    className="btn-neutral btn-icon btn-round"
                    color="google"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="fab fa-google-plus"></i>
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <InputGroup className={'no-border' + (emailFocus ? ' input-group-focus' : '')}>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="now-ui-icons ui-1_email-85"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email..."
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                  />
                </InputGroup>
                <InputGroup className={'no-border' + (firstFocus ? ' input-group-focus' : '')}>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="now-ui-icons users_circle-08"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="User Name..."
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFirstFocus(true)}
                    onBlur={() => setFirstFocus(false)}
                  />
                </InputGroup>
                <InputGroup className={'no-border' + (lastFocus ? ' input-group-focus' : '')}>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="now-ui-icons ui-1_lock-circle-open"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password..."
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setLastFocus(true)}
                    onBlur={() => setLastFocus(false)}
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
                  Get Started
                </Button>
              </CardFooter>
            </Form>
          </Card>
        </Row>
        <div className="col text-center">
          <Button
            className="btn-round btn-white"
            color="default"
            to="/login"
            outline
            size="lg"
            tag={Link}
          >
            View Login Page
          </Button>
        </div>
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

export default Register;
