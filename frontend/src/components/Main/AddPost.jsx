import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import cryptoServiceInstance from '../../services/CryptoService';

const AddPost = () => {
  const [cryptoTab, setCryptoTab] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [positive, setPositive] = useState('');
  const [category, setCategory] = useState('');
  const [postDate, setPostDate] = useState(dayjs());

  const categories = ['POLITICS', 'CULTURE', 'ECONOMIC', 'TECHNOLOGY', 'SECURITY', 'REGULATIONS', 'RECOMMENDATIONS', 'OTHER', 'ECOLOGY', 'PANDEMY'];

  useEffect(() => {
    cryptoServiceInstance.getCryptoNames().then((cryptoNames) => {
      if (cryptoNames && cryptoNames.AvailableCryptoCurrencies) {
        setCryptoTab(cryptoNames.AvailableCryptoCurrencies);
      } else {
        console.error('Unexpected format of cryptoNames:', cryptoNames);
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPost = {
      cryptoName: selectedCrypto,
      title,
      link,
      positive,
      category,
      date: postDate.format('YYYY-MM-DD'),
    };


    cryptoServiceInstance.addCryptoPost(newPost).then(() => {
      alert('Post added successfully!');
 
      setSelectedCrypto('');
      setTitle('');
      setLink('');
      setPositive('');
      setCategory('');
      setPostDate(dayjs());
    }).catch((error) => {
      console.error('Error adding post:', error);
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4, mx: 'auto', width: '50%' }}>
        <FormControl fullWidth>
          <InputLabel id="crypto-select-label">Cryptocurrency</InputLabel>
          <Select
            labelId="crypto-select-label"
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value)}
            required
          >
            {cryptoTab.map((crypto) => (
              <MenuItem key={crypto} value={crypto}>
                {crypto}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />
        <FormControl fullWidth>
          <InputLabel id="positive-select-label">Positive/Negative</InputLabel>
          <Select
            labelId="positive-select-label"
            value={positive}
            onChange={(e) => setPositive(e.target.value)}
            required
          >
            <MenuItem value="true">true</MenuItem>
            <MenuItem value="false">false</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <DatePicker
          label="Post Date"
          value={postDate}
          onChange={(date) => setPostDate(date)}
          required
        />
        <Button type="submit" variant="contained" color="primary">Add Post</Button>
      </Box>
    </LocalizationProvider>
  );
};

export default AddPost;
