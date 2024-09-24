import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Badge, Modal, ModalBody, ModalFooter, Container, Row, Col } from 'reactstrap';

interface Bill {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  items: Array<{
    productId: {
      name: string;
    };
    quantity: number;
  }>;
  totalPrice: number;
  status: string;
}

const BillAdminPage: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch bills from backend
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get('http://localhost:5000/bills');
        setBills(response.data);
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };
    fetchBills();
  }, []);

  // Update the status of a bill
  const updateBillStatus = async (billId: string, newStatus: string) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/bills/${billId}/status`, { status: newStatus });
      setBills((prevBills) =>
        prevBills.map((bill) => (bill._id === billId ? { ...bill, status: newStatus } : bill))
      );
    } catch (error) {
      console.error('Error updating bill status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a bill
  const deleteBill = async (billId: string) => {
    try {
      await axios.delete(`http://localhost:5000/bills/${billId}`);
      setBills((prevBills) => prevBills.filter((bill) => bill._id !== billId));
      setModalOpen(false); // Close the modal after deletion
    } catch (error) {
      console.error('Error deleting bill:', error);
    }
  };

  const toggleModal = (bill: Bill | null = null) => {
    setSelectedBill(bill);
    setModalOpen(!modalOpen);
  };

  const getNextStatus = (currentStatus: string) => {
    if (currentStatus === 'In Process') return 'On Delivery';
    if (currentStatus === 'On Delivery') return 'Done';
    return null; // Once it's done, no more status updates are possible
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2>Manage Bills</h2>
          <Table striped>
            <thead>
              <tr>
                <th>Bill ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill._id}>
                  <td>{bill._id}</td>
                  <td>{bill.userId?.name || 'Unknown'}</td>
                  <td>
                    {bill.items.map((item, index) => (
                      <div key={index}>
                        {item.productId.name} x {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td>{bill.totalPrice}</td>
                  <td>
                    {bill.status === 'In Process' && <Badge color="secondary">In Process</Badge>}
                    {bill.status === 'On Delivery' && <Badge color="danger">On Delivery</Badge>}
                    {bill.status === 'Done' && <Badge color="success">Done</Badge>}
                  </td>
                  <td>
                    {getNextStatus(bill.status) && (
                      <Button
                        color={bill.status === 'In Process' ? 'info' : 'success'}
                        onClick={() => updateBillStatus(bill._id, getNextStatus(bill.status)!)}
                        disabled={loading}
                      >
                        {bill.status === 'In Process' ? 'Set On Delivery' : 'Set Done'}
                      </Button>
                    )}
                    <Button color="danger" onClick={() => toggleModal(bill)}>
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={modalOpen} toggle={() => toggleModal(null)}>
        <ModalBody>Are you sure you want to delete this bill?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={() => deleteBill(selectedBill!._id)}>
            Yes, Delete
          </Button>
          <Button color="secondary" onClick={() => toggleModal(null)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default BillAdminPage;
