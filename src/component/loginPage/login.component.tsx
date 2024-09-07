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
  emailOrUsername: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [firstFocus, setFirstFocus] = useState<boolean>(false);
  const [lastFocus, setLastFocus] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    emailOrUsername: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState<string>('');
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        emailOrUsername: formData.emailOrUsername,
        password: formData.password,
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setModalMessage('Account login successfully!');
    } catch (error) {
      setModalMessage('Failed to login account. Please try again.');
      setErrorMessage('Invalid email/username or password');
    } finally {
      setModal(true);
    }
  };

  const closeModal = () => {
    setModal(false);
    if (modalMessage === 'Account login successfully!') {
      navigate('/');
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
                    className={
                      'no-border input-lg' + (firstFocus ? ' input-group-focus' : '')
                    }
                  >
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="now-ui-icons ui-1_email-85"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email or User Name..."
                      type="text"
                      name="emailOrUsername"
                      value={formData.emailOrUsername}
                      onChange={handleChange}
                      onFocus={() => setFirstFocus(true)}
                      onBlur={() => setFirstFocus(false)}
                    />
                  </InputGroup>
                  <InputGroup
                    className={
                      'no-border input-lg' + (lastFocus ? ' input-group-focus' : '')
                    }
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
                      onFocus={() => setLastFocus(true)}
                      onBlur={() => setLastFocus(false)}
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
                  >
                    Log In
                  </Button>
                  <div className="pull-left">
                    <h6>
                      <a className="link" href="/signup">
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
          toggle={closeModal}
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
            <Button className="btn-neutral" color="link" onClick={closeModal}>
              Close
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default LoginPage;
