import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  Row,
  Col,
  ListGroupItem,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Input,
  Spinner,
} from 'reactstrap';
import '../assets/css/aquarium_css/shop.css';

// Function to format numbers into specific locale
const formatNumber = (number: number) => {
  return new Intl.NumberFormat('de-DE').format(number);
};

// Define types for Fish and Item data structure
interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  productType: 'Fish' | 'Item'; // To distinguish between fish and items
}

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch both fish and items based on the search query
  const fetchProducts = async (query: string) => {
    if (!query) {
      setProducts([]);
      return;
    }

    setLoading(true);

    try {
      const [fishResponse, itemResponse] = await Promise.all([
        axios.get(`http://localhost:5000/fishs?name=${query}`),
        axios.get(`http://localhost:5000/items?name=${query}`),
      ]);

      const fishResults = fishResponse.data.map((fish: any) => ({ ...fish, productType: 'Fish' }));
      const itemResults = itemResponse.data.map((item: any) => ({ ...item, productType: 'Item' }));

      setProducts([...fishResults, ...itemResults]);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    fetchProducts(query);
  };

  const truncateDescription = (description: string, maxLength: number) => {
    return description.length > maxLength ? description.slice(0, maxLength) + '... read more' : description;
  };

  return (
    <Container fluid>
      <div className="text-center">
        <h1 className="post-heading title">
          <span>S</span>
          <span>E</span>
          <span>A</span>
          <span>R</span>
          <span>C</span>
          <span>H</span>
        </h1>
      </div>

      {/* Search Input */}
      <Row className="mb-4">
        <Col xs="12">
          <Input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for fish or items by name..."
          />
        </Col>
      </Row>

      {loading ? (
        <Spinner color="primary" />
      ) : (
        <Row>
          {products.length === 0 ? (
            <Col>
              <p>No results found</p>
            </Col>
          ) : (
            products.map((product) => (
              <Col md="4" key={product._id} className="mb-5">
                <Card className="product-card">
                  <CardImg
                    className="product-img"
                    top
                    width="100%"
                    src={require(`../assets/img/aquarium/${product.image}`)}
                    alt={product.name}
                  />
                  <CardBody className="card-body">
                    <CardTitle tag="h5">{product.name} ({product.productType})</CardTitle>
                    <CardText>{truncateDescription(product.description, 100)}</CardText>
                    <CardText>
                      <strong>{formatNumber(product.price)} VNĐ</strong>
                    </CardText>
                    <Link to={`/${product.productType.toLowerCase()}/${product._id}`}>
                      <Button color="warning">Buy Now</Button>
                    </Link>
                  </CardBody>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
    </Container>
  );
};

export default SearchPage;
