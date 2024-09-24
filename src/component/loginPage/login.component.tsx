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
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('login-page', 'sidebar-collapse');
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
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token, role } = response.data;
      localStorage.setItem('token', token); // Store token in local storage
  
      // Check the role and navigate
      if (role === 'admin') {
        navigate('/admin');  // Redirect to admin page
      } else {
        navigate('/dashboard');  // Redirect to user dashboard
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
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
                      onFocus={() => setIsFocused((prev) => ({ ...prev, email: true }))}
                      onBlur={() => setIsFocused((prev) => ({ ...prev, email: false }))}
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
                      placeholder="Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setIsFocused((prev) => ({ ...prev, password: true }))}
                      onBlur={() => setIsFocused((prev) => ({ ...prev, password: false }))}
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
                </CardFooter>
              </Form>
            </Card>
          </Col>
        </Container>
      </div>
    </div>
  );
};

export default LoginPage;
