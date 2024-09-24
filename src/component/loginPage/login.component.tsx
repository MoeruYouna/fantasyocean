import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Form,
  Input,
  Modal,
  ModalBody,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col,
} from 'reactstrap';

interface FormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [isFocused, setIsFocused] = useState<{ [key: string]: boolean }>({
    email: false,
    password: false,
  });
  const [modal, setModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('login-page', 'sidebar-collapse');
    document.documentElement.classList.remove('nav-open');
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    return () => {
      document.body.classList.remove('login-page', 'sidebar-collapse');
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFocus = (field: string, focused: boolean) => {
    setIsFocused((prev) => ({
      ...prev,
      [field]: focused,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });
  
      const { token } = response.data;
      localStorage.setItem('token', token); 
      setModalMessage('Account login successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error); // Log error for debugging
      setModalMessage('Failed to login account. Please try again.');
      setErrorMessage(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
      setModal(true);
    }
  };
  

  return (
    <div className="page-header clear-filter" filter-color="blue">
      <div
        className="page-header-image"
        style={{
          backgroundImage: "url(" + require('../assets/img/login.jpg') + ")",
        }}
      ></div>
      <div className="content">
        <Container>
          <Col className="ml-auto mr-auto" md="4">
            <Card className="card-login card-plain">
              <Form onSubmit={handleSubmit} className="form">
                <CardHeader className="text-center">
                  <div className="logo-container">
                    <img
                      alt="..."
                      src={require('../assets/img/aquarium/Logo.png')}
                    ></img>
                  </div>
                </CardHeader>
                <CardBody>
                  <InputGroup
                    className={`no-border input-lg ${isFocused.email ? 'input-group-focus' : ''}`}
                  >
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="now-ui-icons ui-1_email-85"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => handleFocus('email', true)}
                      onBlur={() => handleFocus('email', false)}
                    />
                  </InputGroup>
                  <InputGroup
                    className={`no-border input-lg ${isFocused.password ? 'input-group-focus' : ''}`}
                  >
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="now-ui-icons ui-1_lock-circle-open"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password..."
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => handleFocus('password', true)}
                      onBlur={() => handleFocus('password', false)}
                    />
                  </InputGroup>
                  {errorMessage && <p className="text-danger">{errorMessage}</p>}
                </CardBody>
                <CardFooter className="text-center">
                  <Button
                    block
                    className="btn-round"
                    color="info"
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Log In'}
                  </Button>
                  <div className="pull-left">
                    <h6>
                      <a className="link" href="/register">
                        Create Account
                      </a>
                    </h6>
                  </div>
                  <div className="pull-right">
                    <h6>
                      <a className="link" href="#pablo" onClick={(e) => e.preventDefault()}>
                        Need Help?
                      </a>
                    </h6>
                  </div>
                </CardFooter>
              </Form>
            </Card>
          </Col>
        </Container>
        <Modal
          modalClassName="modal-mini modal-info"
          isOpen={modal}
        >
          <div className="modal-header justify-content-center">
            <div className="modal-profile">
              <i className="now-ui-icons users_circle-08"></i>
            </div>
          </div>
          <ModalBody>
            <p>{modalMessage}</p>
          </ModalBody>
          <div className="modal-footer">
            <Button className="btn-neutral" color="link" >
              Close
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default LoginPage;
