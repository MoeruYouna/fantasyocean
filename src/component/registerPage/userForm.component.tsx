import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const avatarImages = ['avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg'];

const UserFormPage: React.FC = () => {
  const [formData, setFormData] = useState({ age: '', address: '', avt: '', description: '' });
  const [selectedAvatar, setSelectedAvatar] = useState<string>(avatarImages[0]); // Default avatar
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedAvatar(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formDataToSend = {
      ...formData,
      avt: selectedAvatar,
    };

    try {
      const response = await axios.put('http://localhost:5000/api/user/profile', formDataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/dashboard'); // Redirect to the dashboard after profile update
      console.log('Profile updated:', response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile. Please try again.');
    }
  };

  return (
    <div>
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="age" placeholder="Age" value={formData.age} onChange={handleChange} />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />

        <label htmlFor="avatar">Choose Avatar:</label>
        <select name="avatar" value={selectedAvatar} onChange={handleAvatarChange}>
          {avatarImages.map((image) => (
            <option key={image} value={image}>
              {image}
            </option>
          ))}
        </select>

        {/* Display selected avatar */}
        <div>
          <p>Selected Avatar:</p>
          <img
            src={require(`../assets/img/profile/${selectedAvatar}`)}
            alt="Selected Avatar"
            style={{ width: '150px', height: '150px' }}
          />
        </div>

        {errorMessage && <p>{errorMessage}</p>}
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default UserFormPage;
