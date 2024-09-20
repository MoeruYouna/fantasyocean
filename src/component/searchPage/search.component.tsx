import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Typography, CardMedia, TextField, CircularProgress } from '@mui/material';

interface Fish {
  _id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  price: number;
}

const SearchResultsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [results, setResults] = useState<Fish[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch results based on the search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5000/fishs?name=${searchQuery}`);
        setResults(response.data);
      } catch (err) {
        setError('Failed to fetch results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery]);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Search for Fish
      </Typography>
      <TextField
        label="Search by Name"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ marginBottom: 4 }}
      />
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={4}>
          {results.map((fish) => (
            <Grid item xs={12} sm={6} md={4} key={fish._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={require(`../assets/img/aquarium/${fish.image}`)}
                  alt={fish.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {fish.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {fish.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: {fish.price} VNĐ
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {fish.category}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SearchResultsPage;
