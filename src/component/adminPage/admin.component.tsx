import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, CardImg, Container, Modal, ModalBody, ModalFooter } from 'reactstrap';
import './admin.css';

// Define the type for Fish and Item
interface Fish {
  _id: string;
  name: string;
  image: string;
  category: string;
  description: string;
  price: number;
}

interface Item {
  _id: string;
  name: string;
  image: string;
  category: string;
  description: string;
  price: number;
}

const AdminPage: React.FC = () => {
  const [fishs, setFishs] = useState<Fish[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<'fish' | 'item' | null>(null); // to track if it's fish or item to delete
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [fishResponse, itemResponse] = await Promise.all([
        axios.get('http://localhost:5000/fishs'),
        axios.get('http://localhost:5000/items'),
      ]);
      setFishs(fishResponse.data);
      setItems(itemResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const openDeleteModal = (id: string, type: 'fish' | 'item') => {
    setDeleteId(id);
    setDeleteType(type);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId || !deleteType) return;

    setIsLoading(true);

    try {
      const endpoint =
        deleteType === 'fish'
          ? `http://localhost:5000/fishs/delete/${deleteId}`
          : `http://localhost:5000/items/item/delete/${deleteId}`;
      await axios.delete(endpoint);

      // Update UI
      if (deleteType === 'fish') {
        setFishs(fishs.filter((fish) => fish._id !== deleteId));
      } else {
        setItems(items.filter((item) => item._id !== deleteId));
      }

      setDeleteModalOpen(false);
      setDeleteId(null);
      setDeleteType(null);
    } catch (err) {
      console.error('Error deleting item:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setDeleteModalOpen(false);
    setDeleteId(null);
    setDeleteType(null);
  };

  return (
    <Container>
      <div className="fish-list">
        <h2>Manage Products</h2>
        <Button
          className="btn-them btn-round btn-white"
          color="default"
          to="/admin/insertF"
          outline
          size="lg"
          tag={Link}
        >
          Add New Product
        </Button>
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Product Image</th>
              <th>Category</th>
              <th>Description</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fishs.map((fish) => (
              <tr key={fish._id}>
                <td>{fish._id}</td>
                <td>{fish.name}</td>
                <td>
                  <CardImg
                    className="product-img"
                    top
                    width="1px"
                    src={require(`../assets/img/aquarium/${fish.image}`)}
                    alt={fish.name}
                  />
                </td>
                <td>{fish.category}</td>
                <td>{fish.description}</td>
                <td>{fish.price}</td>
                <td>
                  <button className="btn-sua">Edit</button>
                  <button className="btn-xoa" onClick={() => openDeleteModal(fish._id, 'fish')}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.name}</td>
                <td>
                  <CardImg
                    className="product-img"
                    top
                    width="1px"
                    src={require(`../assets/img/aquarium/${item.image}`)}
                    alt={item.name}
                  />
                </td>
                <td>{item.category}</td>
                <td>{item.description}</td>
                <td>{item.price}</td>
                <td>
                  <button className="btn-sua">Edit</button>
                  <button className="btn-xoa" onClick={() => openDeleteModal(item._id, 'item')}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} toggle={closeModal}>
        <ModalBody>
          <p>Are you sure you want to delete this product?</p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Yes, Delete'}
          </Button>{' '}
          <Button color="secondary" onClick={closeModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default AdminPage;
