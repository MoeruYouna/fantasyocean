import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, CardBody, CardHeader, Input, Container, Col, Form, FormGroup } from 'reactstrap';

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
        setFormData(response.data); // Set initial form data
      } catch (error: any) {
        console.error('Failed to fetch user profile:', error);
        setErrorMessage('Failed to load profile. Please try again.');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <Container className="mt-5">
      <Col className="ml-auto mr-auto" md="6">
        <Card className="card-user">
          <CardHeader className="text-center">
            <div className="profile-container">
              {user?.avt ? (
                <img
                  src={`http://localhost:5000/${user?.avt}`} // Adjust the path
                  alt="Profile Avatar"
                  className="rounded-circle"
                  style={{ width: '150px', height: '150px' }}
                />

              ) : (
                <div className="default-avatar">
                  <i className="now-ui-icons users_circle-08" style={{ fontSize: '50px' }}></i>
                </div>
              )}
            </div>
            <h4>{user?.name || 'User Name'}</h4>
            <p>{user?.email}</p>
          </CardHeader>

          <CardBody>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            {isEditing ? (
              <Form onSubmit={handleUpdateProfile}>
                <FormGroup>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    name="age"
                    value={formData.age?.toString() || ''}
                    onChange={handleChange}
                    placeholder="Age"
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    placeholder="Address"
                  />
                </FormGroup>

                {/* Avatar upload */}
                <FormGroup>
                  <Input
                    type="file"
                    name="avt"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </FormGroup>

                <Button type="submit" color="primary">
                  Save Changes
                </Button>
                <Button color="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </Form>
            ) : (
              <>
                <p><strong>Age:</strong> {user?.age || 'N/A'}</p>
                <p><strong>Address:</strong> {user?.address || 'N/A'}</p>
                <p><strong>Description:</strong> {user?.description || 'No description available.'}</p>
                <Button color="warning" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
                <Button color="danger" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </CardBody>
        </Card>
      </Col>
    </Container>
  );
};

export default Dashboard;
