import React, { useEffect, useState } from 'react';
import { getData } from '../services/apis';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  AppBar, Toolbar, Typography, Container, FormControl, InputLabel, Select, MenuItem,
  Grid, Paper, CssBaseline, Box, Drawer, List, ListItem, ListItemText
} from '@mui/material';

const drawerWidth = 240;

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    endYear: '',
    topic: '',
    sector: '',
    region: '',
    pestle: '',
    source: '',
    swot: '',
    country: '',
    city: ''
  });

  const [uniqueValues, setUniqueValues] = useState({
    endYears: [],
    topics: [],
    sectors: [],
    regions: [],
    pestles: [],
    sources: [],
    swots: [],
    countries: [],
    cities: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData();
        setData(result);
        setFilteredData(result);
        extractUniqueValues(result);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const extractUniqueValues = (data) => {
    const endYears = [...new Set(data.map(item => item.end_year))].filter(Boolean);
    const topics = [...new Set(data.map(item => item.topic))];
    const sectors = [...new Set(data.map(item => item.sector))];
    const regions = [...new Set(data.map(item => item.region))];
    const pestles = [...new Set(data.map(item => item.pestle))];
    const sources = [...new Set(data.map(item => item.source))];
    const swots = [...new Set(data.map(item => item.swot))];
    const countries = [...new Set(data.map(item => item.country))];
    const cities = [...new Set(data.map(item => item.city))];

    setUniqueValues({ endYears, topics, sectors, regions, pestles, sources, swots, countries, cities });
  };

  useEffect(() => {
    const applyFilters = () => {
      let filtered = data;
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          filtered = filtered.filter(item => item[key] === filters[key]);
        }
      });
      setFilteredData(filtered);
    };
    applyFilters();
  }, [filters, data]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Data Visualization Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
    
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Filters
                </Typography>
                <Grid container spacing={3}>
                  {['endYear', 'topic', 'sector', 'region', 'pestle', 'source', 'swot', 'country', 'city'].map((filter, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <FormControl fullWidth>
                        <InputLabel>{filter.charAt(0).toUpperCase() + filter.slice(1)}</InputLabel>
                        <Select
                          name={filter}
                          value={filters[filter]}
                          onChange={handleFilterChange}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {uniqueValues[`${filter}s`] && uniqueValues[`${filter}s`].map((value) => (
                            <MenuItem key={value} value={value}>{value}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Data Overview
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <BarChart width={500} height={300} data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="country" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="intensity" fill="#8884d8" />
                      <Bar dataKey="likelihood" fill="#82ca9d" />
                      <Bar dataKey="relevance" fill="#ffc658" />
                    </BarChart>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LineChart width={500} height={300} data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="intensity" stroke="#8884d8" />
                      <Line type="monotone" dataKey="likelihood" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="relevance" stroke="#ffc658" />
                    </LineChart>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Detailed View
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <PieChart width={400} height={400}>
                      <Pie
                        data={filteredData}
                        dataKey="intensity"
                        nameKey="country"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                      >
                        {
                          filteredData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)
                        }
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6">Top Intensity</Typography>
                    {filteredData.length > 0 && (
                      <Typography variant="body1">
                        {filteredData.reduce((max, item) => item.intensity > max.intensity ? item : max, filteredData[0]).title}
                      </Typography>
                    )}
                    <Typography variant="h6">Least Intensity</Typography>
                    {filteredData.length > 0 && (
                      <Typography variant="body1">
                        {filteredData.reduce((min, item) => item.intensity < min.intensity ? item : min, filteredData[0]).title}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard;
