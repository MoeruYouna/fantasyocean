import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/aquarium_css/shop.css';
import axios from 'axios';
import {
  Button,
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
} from 'reactstrap';

const categories = ["All", "Category 1", "Category 2", "Category 3"];

// Function to format numbers into specific locale
const formatNumber = (number: number) => {
  return new Intl.NumberFormat('de-DE').format(number);
};

// Define types for Fish data structure
interface Fish {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
}

// Define types for Component State
interface State {
  selectedCategory: string;
  fishs: Fish[];
}

class ShopPage extends React.Component<{}, State> {
  state: State = {
    selectedCategory: 'All',
    fishs: [],
  };

  componentDidMount() {
    this.fetchFishs();
  }

  // Fetches fish data from backend
  fetchFishs = async () => {
    try {
      const response = await axios.get<Fish[]>('http://localhost:5000/fishs');
      this.setState({ fishs: response.data });
    } catch (error) {
      console.error('Error fetching fishs:', error);
    }
  };

  // Handles category click to filter fish
  handleCategoryClick = (category: string) => {
    this.setState({ selectedCategory: category });
  };

  // Filters fish based on selected category
  filterFishs = () => {
    const { selectedCategory, fishs } = this.state;
    if (selectedCategory === 'All') {
      return fishs;
    }
    return fishs.filter((fish) => fish.category === selectedCategory);
  };

  // Truncates fish description if too long
  truncateDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + "... read more";
    }
    return description;
  };

  render() {
    const filteredFishs = this.filterFishs();
    return (
      <Container fluid>
        <div className="text-center">
          <h1 className="post-heading title">
            <span>S</span>
            <span>H</span>
            <span>O</span>
            <span>P</span>
          </h1>
        </div>
        <Row>
          <Col xs="3">
            <h5>Categories</h5>
            <ListGroup>
              {categories.map((category, index) => (
                <ListGroupItem
                  key={index}
                  active={this.state.selectedCategory === category}
                  onClick={() => this.handleCategoryClick(category)}
                  style={{ cursor: 'pointer' }}
                >
                  {category}
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
          <Col xs="9">
            <Row>
              {filteredFishs.map((fish) => (
                <Col md="3" key={fish._id} className="mb-2">
                  <Card className="product-card">
                    <CardImg
                      className="product-img"
                      top
                      width="100%"
                      src={require(`../assets/img/aquarium/${fish.image}`)}
                      alt={fish.name}
                    />
                    <CardBody>
                      <CardTitle tag="h5">{fish.name}</CardTitle>
                      <CardText>
                        {this.truncateDescription(fish.description, 100)}
                      </CardText>
                      <CardText>
                        <strong>{formatNumber(fish.price)} VNĐ</strong>
                      </CardText>
                      <Link to={`/fish/${fish._id}`}>
                        <Button color="warning">Chọn Ngay</Button>
                        <Button className="btn-icon btn-round" color="info" type="button">
                          <i className="now-ui-icons ui-2_favourite-28"></i>
                        </Button>
                      </Link>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ShopPage;
