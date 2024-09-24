import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Container,
  Col,
  Form,
  FormGroup,
  Row,
  Label,
} from 'reactstrap';

interface UserProfile {
  name: string;
  email: string;
  age?: number;
  address?: string;
  avt?: string; // Avatar URL
  description?: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserProfile>({ name: '', email: '' });
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // Store the selected file
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setFormData(response.data);
      } catch (error: any) {
        console.error('Failed to fetch user profile:', error);
        setErrorMessage('Failed to load profile. Please try again.');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formDataToSend = new FormData();

    // Add other form data to FormData object
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value as string);
    });

    // If an avatar file is selected, add it to the form data
    if (avatarFile) {
      formDataToSend.append('avt', avatarFile);
    }

    try {
      const response = await axios.put('http://localhost:5000/api/user/profile', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser(response.data);
      setIsEditing(false);
      setErrorMessage('');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      setErrorMessage('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${require('../assets/img/bg8.jpg')})`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        padding: '4rem 0',  // Add padding to ensure equal spacing at the top and bottom
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md="5"> {/* Further reduced width for compactness */}
            <Card className="shadow-lg" style={{ borderRadius: '20px' }}> {/* Increased border-radius */}
              <CardHeader
                className="text-center"
                style={{
                  backgroundColor: 'rgb(55, 162, 245)',
                  color: '#fff',
                  borderTopLeftRadius: '20px', // Rounded top
                  borderTopRightRadius: '20px',
                }}
              >
                <div className="d-flex justify-content-center">
                  {user?.avt ? (
                    <img
                      src={require(`../assets/img/profile/${user.avt}`)}
                      alt="Profile Avatar"
                      className="rounded-circle"
                      style={{
                        width: '110px', // Further reduced size for compactness
                        height: '110px',
                        objectFit: 'cover',
                        border: '4px solid #fff',
                        transition: 'transform 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  ) : (
                    <div className="rounded-circle bg-light d-flex justify-content-center align-items-center" style={{ width: '110px', height: '110px' }}>
                      <i className="now-ui-icons users_circle-08" style={{ fontSize: '50px' }}></i>
                    </div>
                  )}
                </div>
                <h3 className="mt-3">{user?.name || 'User Name'}</h3>
                <p>{user?.email}</p>
              </CardHeader>

              <CardBody>
                {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
                {isEditing ? (
                  <Form onSubmit={handleUpdateProfile}>
                    <Row>
                      <Col md="12"> {/* Single column for compact form */}
                        <FormGroup>
                          <Label for="name">Name</Label>
                          <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Name"
                            className="mb-2"
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="email">Email</Label>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="mb-2"
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="age">Age</Label>
                          <Input
                            type="number"
                            name="age"
                            value={formData.age?.toString() || ''}
                            onChange={handleChange}
                            placeholder="Age"
                            className="mb-2"
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="address">Address</Label>
                          <Input
                            type="text"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleChange}
                            placeholder="Address"
                            className="mb-2"
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="description">Description</Label>
                          <Input
                            type="textarea"
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            placeholder="Tell us about yourself"
                            className="mb-2"
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="avt">Profile Picture</Label>
                          <Input
                            type="file"
                            name="avt"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <div className="text-center">
                      <Button type="submit" style={{ backgroundColor: 'rgb(55, 162, 245)' }} className="mr-2">
                        Save Changes
                      </Button>
                      <Button color="secondary" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <>
                    <Row className="mb-2">
                      <Col md="6">
                        <p>
                          <strong>Age:</strong> {user?.age || 'N/A'}
                        </p>
                      </Col>
                      <Col md="6">
                        <p>
                          <strong>Address:</strong> {user?.address || 'N/A'}
                        </p>
                      </Col>
                    </Row>
                    <p>
                      <strong>Description:</strong> {user?.description || 'No description available.'}
                    </p>
                    <div className="text-center">
                      <Button style={{ backgroundColor: 'rgb(55, 162, 245)' }} className="mr-2" onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                      <Button color="danger" onClick={handleLogout}>
                        Logout
                      </Button>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
