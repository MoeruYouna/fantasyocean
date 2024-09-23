import React from 'react';
import { Link } from 'react-router-dom';
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
import '../assets/css/aquarium_css/shop.css';

// Separate Fish and Item categories
const fishCategories = ["All", "Fish", "Turtle", "Crab", "Lobster"];
const itemCategories = ["All", "Stone", "Tree", "Led", "Tank"];

// Function to format numbers into specific locale
const formatNumber = (number: number) => {
  return new Intl.NumberFormat('de-DE').format(number);
};

// Define types for Fish and Item data structure
interface Fish {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
}

interface Item {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
}

// Define types for Component State
interface State {
  selectedFishCategory: string;
  selectedItemCategory: string;
  fishs: Fish[];
  items: Item[];
  currentPage: number;
  itemsPerPage: number;
}

class ShopPage extends React.Component<{}, State> {
  state: State = {
    selectedFishCategory: 'All',
    selectedItemCategory: 'All',
    fishs: [],
    items: [],
    currentPage: 1,
    itemsPerPage: 6,
  };

  componentDidMount() {
    this.fetchFishs();
    this.fetchItems();
  }

  // Fetch fish data from backend based on selected category
  fetchFishs = async () => {
    const { selectedFishCategory } = this.state;
    let url = 'http://localhost:5000/fishs';

    // If a category other than 'All' is selected, filter by category
    if (selectedFishCategory !== 'All') {
      url += `?category=${selectedFishCategory}`;
    }

    try {
      const response = await axios.get<Fish[]>(url);
      this.setState({ fishs: response.data });
    } catch (error) {
      console.error('Error fetching fishs:', error);
    }
  };

  // Fetch item data from backend based on selected category
  fetchItems = async () => {
    const { selectedItemCategory } = this.state;
    let url = 'http://localhost:5000/items';

    // If a category other than 'All' is selected, filter by category
    if (selectedItemCategory !== 'All') {
      url += `?category=${selectedItemCategory}`;
    }

    try {
      const response = await axios.get<Item[]>(url);
      this.setState({ items: response.data });
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  // Handles fish category click to filter fish
  handleFishCategoryClick = (category: string) => {
    this.setState({ selectedFishCategory: category, currentPage: 1 }, () => {
      this.fetchFishs(); // Fetch fish based on new category
    });
  };

  // Handles item category click to filter items
  handleItemCategoryClick = (category: string) => {
    this.setState({ selectedItemCategory: category, currentPage: 1 }, () => {
      this.fetchItems(); // Fetch items based on new category
    });
  };

  // Truncate fish/item description if too long
  truncateDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + '... read more';
    }
    return description;
  };

  // Handles pagination
  handlePageChange = (pageNumber: number) => {
    this.setState({ currentPage: pageNumber });
  };

  renderPaginationControls = (totalItems: number) => {
    const { currentPage, itemsPerPage } = this.state;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null;

    return (
      <div className="pagination-controls">
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index + 1}
            color={index + 1 === currentPage ? 'primary' : 'secondary'}
            onClick={() => this.handlePageChange(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
      </div>
    );
  };

  render() {
    const { currentPage, itemsPerPage, fishs, items } = this.state;

    // Paginate fish and items
    const fishsToShow = fishs.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    const itemsToShow = items.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

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
          {/* Fish Categories and Products */}
          <Col xs="3">
            <h5>Fish Categories</h5>
            <ListGroup>
              {fishCategories.map((category, index) => (
                <ListGroupItem
                  key={index}
                  active={this.state.selectedFishCategory === category}
                  onClick={() => this.handleFishCategoryClick(category)}
                  style={{ cursor: 'pointer' }}
                >
                  {category}
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
          <Col xs="9">
            <h3>Fish Products</h3>
            <Row>
              {fishsToShow.map((fish) => (
                <Col md="4" key={fish._id} className="mb-5">
                  <Card className="product-card">
                    <CardImg
                      className="product-img"
                      top
                      width="100%"
                      src={require(`../assets/img/aquarium/${fish.image}`)}
                      alt={fish.name}
                    />
                    <CardBody className="card-body">
                      <CardTitle tag="h5">{fish.name}</CardTitle>
                      <CardText>{this.truncateDescription(fish.description, 100)}</CardText>
                      <CardText>
                        <strong>{formatNumber(fish.price)} VNĐ</strong>
                      </CardText>
                      <Link to={`/fish/${fish._id}`}>
                        <Button color="warning">Chọn Ngay</Button>
                      </Link>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
            {this.renderPaginationControls(fishs.length)}
          </Col>
        </Row>

        {/* Item Categories and Products */}
        <Row className="mt-4">
          <Col xs="3">
            <h5>Item Categories</h5>
            <ListGroup>
              {itemCategories.map((category, index) => (
                <ListGroupItem
                  key={index}
                  active={this.state.selectedItemCategory === category}
                  onClick={() => this.handleItemCategoryClick(category)}
                  style={{ cursor: 'pointer' }}
                >
                  {category}
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
          <Col xs="9">
            <h3>Other Items</h3>
            <Row>
              {itemsToShow.map((item) => (
                <Col md="4" key={item._id} className="mb-2">
                  <Card className="product-card">
                    <CardImg
                      className="product-img"
                      top
                      width="100%"
                      src={require(`../assets/img/aquarium/${item.image}`)}
                      alt={item.name}
                    />
                    <CardBody className="card-body">
                      <CardTitle tag="h5">{item.name}</CardTitle>
                      <CardText>{this.truncateDescription(item.description, 100)}</CardText>
                      <CardText>
                        <strong>{formatNumber(item.price)} VNĐ</strong>
                      </CardText>
                      <Link to={`/item/${item._id}`}>
                        <Button color="warning">Buy Now</Button>
                      </Link>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
            {this.renderPaginationControls(items.length)}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ShopPage;
