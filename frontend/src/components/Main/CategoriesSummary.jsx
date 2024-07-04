import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import cryptoServiceInstance from '../../services/CryptoService.js';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Select, MenuItem, Box } from '@mui/material';
import TokenService from '../../services/TokenService.js';
import AlertModal from '../../components/AlertModals/AlertModal';
import { useNavigate } from 'react-router-dom';
const CategoriesSummary = () => {
  const [cryptoTab, setCryptoTab] = useState([]);
  const [currentQuotes, setCurrentQuotes] = useState([]);
  const [cryptoPosts, setCryptoPosts] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('All cryptos');
  const [selectedCrypto2, setSelectedCrypto2] = useState('All cryptos');
  const [positiveNegativeData, setPositiveNegativeData] = useState({ categories: [], series: [] });
  const [startDate, setStartDate] = useState(dayjs('2018-02-25'));
  const [endDate, setEndDate] = useState(dayjs('2023-03-07'));
  const [currentPickedPosts, setCurrentPickedPosts] = useState([]);
  const [minDate, setMinDate] = useState(dayjs('2018-02-25'));
  const [maxDate, setMaxDate] = useState(dayjs('2023-03-07'));
  const [clickedOnce, setClickedOnce] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chartData, setChartData] = useState({
    categories: [],
    seriesData: [],
    countData: [],
  });
  const [selectedChart, setSelectedChart] = useState('percentage');
  const [pieChartData, setPieChartData] = useState({ categories: [], series: [] });

  const navigate = useNavigate();

  const handleCryptoSelect = (e) => {
    setSelectedCrypto2(e.target.value);
    setClickedOnce(true);
  };

  const handleClose = () => {
    TokenService.removeToken();
    setIsExpired(false);
    TokenService.setTokenExpired(false);
    navigate('/login');
  };

  useEffect(() => {
    cryptoServiceInstance.getCryptoNames().then((cryptoNames) => {
      if (cryptoNames && cryptoNames.AvailableCryptoCurrencies) {
        setCryptoTab(['All cryptos', ...cryptoNames.AvailableCryptoCurrencies]);
      } else {
        console.error('Unexpected format of cryptoNames:', cryptoNames);
      }
    });
  }, []);

  const processHistoricalQuotes = (quotes) => {
    const dataByYearMonth = {};
    quotes.forEach((quote) => {
      const date = dayjs(quote.dateTime);
      const year = date.year();
      const month = date.month() + 1;

      if (year >= 2018 && year <= 2023) {
        const key = `${year}-${month < 10 ? '0' + month : month}`;

        if (!dataByYearMonth[key]) {
          dataByYearMonth[key] = [];
        }
        dataByYearMonth[key].push(quote);
      }
    });

    const result = [];
    Object.keys(dataByYearMonth).forEach((key) => {
      const quotesInMonth = dataByYearMonth[key];
      quotesInMonth.sort((a, b) => dayjs(a.dateTime).valueOf() - dayjs(b.dateTime).valueOf());
      const firstQuote = quotesInMonth[0];
      const lastQuote = quotesInMonth[quotesInMonth.length - 1];
      result.push({
        month: key,
        open_price: firstQuote.open_price,
        close_price: lastQuote.close_price,
      });
    });
  };

  useEffect(() => {
    const subscription = (newQuotes, newPosts) => {
      setCurrentQuotes(newQuotes);
      setCryptoPosts(newPosts);
    };

    const unsubscribe = cryptoServiceInstance.subscribe(subscription);

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    processHistoricalQuotes(currentQuotes);
  }, [currentQuotes]);

  const fetchPostsForCrypto = async (crypto) => {
    if (crypto === 'All cryptos') {
      await cryptoServiceInstance.getAllCryptoPosts();
    } else {
      await cryptoServiceInstance.getCryptoPosts(crypto);
    }
    return cryptoServiceInstance.currentCryptoPosts;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const posts = await fetchPostsForCrypto(selectedCrypto);
        const categoryCounts = {};
        const positiveCounts = {};

        posts.forEach(post => {
          const category = post.category;
          if (!categoryCounts[category]) {
            categoryCounts[category] = 0;
            positiveCounts[category] = 0;
          }
          categoryCounts[category]++;
          if (post.positive) {
            positiveCounts[category]++;
          }
        });

        const categoryData = Object.keys(categoryCounts).map(category => {
          const total = categoryCounts[category];
          const positive = positiveCounts[category];
          const percentage = ((positive / total) * 100).toFixed(2);
          return { category, percentage: parseFloat(percentage), count: total };
        });

        categoryData.sort((a, b) => a.percentage - b.percentage);

        const categories = categoryData.map(item => item.category);
        const seriesData = categoryData.map(item => item.percentage);
        const countData = categoryData.map(item => item.count);

        setChartData({ categories, seriesData, countData });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedCrypto]);

  useEffect(() => {
    if (selectedCrypto2) {
      processPieChartData(selectedCrypto2);
    }
  }, [selectedCrypto2, startDate, endDate]);

  const processPieChartData = async (crypto) => {
    try {
      const posts2 = await fetchPostsForCrypto(crypto);

      const filteredPosts = posts2.filter(p =>
        dayjs(p.date).isAfter(startDate, 'day') && dayjs(p.date).isBefore(endDate, 'day')
      );

      setCryptoPosts(posts2);
      setCurrentPickedPosts(filteredPosts);

      if (!filteredPosts || filteredPosts.length === 0) {
        console.warn("No posts found for crypto:", crypto);
        setPieChartData({ categories: [], series: [] });
        setPositiveNegativeData({ categories: [], series: [] });
        return;
      }

      const categoryCounts = filteredPosts.reduce((acc, post) => {
        acc[post.category] = (acc[post.category] || 0) + 1;
        return acc;
      }, {});

      const categories = Object.keys(categoryCounts);
      const series = Object.values(categoryCounts);

      setPieChartData({ categories, series });

      const positiveNegativeCounts = filteredPosts.reduce((acc, post) => {
        if (post.positive) {
          acc.positive += 1;
        } else {
          acc.negative += 1;
        }
        return acc;
      }, { positive: 0, negative: 0 });

      const positiveNegativeCategories = ['Positive', 'Negative'];
      const positiveNegativeSeries = [positiveNegativeCounts.positive, positiveNegativeCounts.negative];

      setPositiveNegativeData({ categories: positiveNegativeCategories, series: positiveNegativeSeries });

    } catch (error) {
      setPieChartData({ categories: [], series: [] });
      setPositiveNegativeData({ categories: [], series: [] });
    }
  };

  useEffect(() => {
    const checkTokenExpired = () => {
      setIsExpired(TokenService.getTokenExpired());
    };

    checkTokenExpired();
    const interval = setInterval(checkTokenExpired, 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    setIsLoggedIn(TokenService.isLoggedIn());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (TokenService.isLoggedIn()) {
          const token = TokenService.getToken(); 
          const posts = await fetchPostsForCrypto(selectedCrypto, token);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedCrypto]);

  const updateChartData = (type) => {
    const sortedData = [...chartData.categories.map((category, index) => ({
      category,
      percentage: chartData.seriesData[index],
      count: chartData.countData[index]
    }))];

    sortedData.sort((a, b) => type === 'percentage' ? a.percentage - b.percentage : a.count - b.count);

    setChartData({
      categories: sortedData.map(item => item.category),
      seriesData: sortedData.map(item => item.percentage),
      countData: sortedData.map(item => item.count)
    });
  };

  useEffect(() => {
    updateChartData(selectedChart);
  }, [selectedChart]);

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: chartData.categories,
    },
    yaxis: {
      title: {
        text: selectedChart === 'percentage' ? 'Percentage of Positive Posts (%)' : 'Count of Posts',
      },
      labels: {
        formatter: function (val) {
          return selectedChart === 'percentage' ? val + '%' : val;
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return selectedChart === 'percentage' ? val + '%' : val;
        },
      },
    },
  };

  const pieChartOptions = {
    labels: pieChartData.categories,
    colors: ['#c72c2c', '#de9759', '#ad5d17', '#a1a122', '#50990c', '#119e68', '#0799b3', '#1523b3', '#558264', '#d1c44f'],
    legend: {
      show: true,
      formatter: (val, opts) => {
        const categoryIndex = opts.seriesIndex;
        const postCount = opts.w.globals.series[categoryIndex];
        const percentage = ((postCount / opts.w.globals.series.reduce((a, b) => a + b, 0)) * 100).toFixed(2);
        return `${val}: ${percentage}% (${postCount})`;
      },
    },
  };

  const positiveNegativePieChartOptions = {
    labels: positiveNegativeData.categories,
    colors: ['#28a745', '#dc3545'],
    legend: {
      show: true,
      formatter: (val, opts) => {
        const categoryIndex = opts.seriesIndex;
        const postCount = opts.w.globals.series[categoryIndex];
        const percentage = ((postCount / opts.w.globals.series.reduce((a, b) => a + b, 0)) * 100).toFixed(2);
        return `${val}: ${percentage}% (${postCount})`;
      },
    },
  };

  const chartSeries = [
    {
      name: selectedChart === 'percentage' ? 'Positive Percentage' : 'Post Count',
      data: selectedChart === 'percentage' ? chartData.seriesData : chartData.countData,
    },
  ];

  return (
    <>
     {isLoggedIn && !isExpired ? (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mx: 2 }}>
          <Select
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value)}
            variant="outlined"
          >
            {cryptoTab.map((crypto) => (
              <MenuItem key={crypto} value={crypto}>
                {crypto}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value)}
            variant="outlined"
          >
            <MenuItem value="percentage">Positive Percentage</MenuItem>
            <MenuItem value="count">Post Count</MenuItem>
          </Select>
        </Box>
        <h2 style={{ textAlign: 'center' }}>{selectedChart === 'percentage' ? 'Percentage of Positive Posts' : 'Count of Posts'}</h2>
        <div id="chart">
          <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
        </div>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mx: 2 }}>
          <Select
            value={selectedCrypto2}
            onChange={handleCryptoSelect}
            variant="outlined"
            displayEmpty
          >
          
            {cryptoTab.map((crypto) => (
              <MenuItem key={crypto} value={crypto}>
                {crypto}
              </MenuItem>
            ))}
          </Select>
          <Box sx={{ display: 'flex', gap: 2, ml: 2 }}>
            <DatePicker
              label="Start Date"
              value={startDate}
              minDate={minDate}
              maxDate={maxDate}
              onChange={(date) => {
                if (date.isBefore(endDate, 'day')) {
                  setStartDate(date);
                } else {
                  alert('Start date cannot be after end date');
                }
              }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              minDate={minDate}
              maxDate={maxDate}
              onChange={(date) => {
                if (date.isAfter(startDate, 'day')) {
                  setEndDate(date);
                } else {
                  alert('End date cannot be before start date');
                }
              }}
            />
          </Box>
        </Box>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px' }}>
          <div style={{ width: '48%' }}>
            <h2 style={{ textAlign: 'center' }}>Percentage Distribution of Each Category and Post Count</h2>
            <div id="pie-chart">
              <Chart options={pieChartOptions} series={pieChartData.series} type="pie" height={450} />
            </div>
          </div>
          <div style={{ width: '48%' }}>
            <h2 style={{ textAlign: 'center' }}>Positive vs Negative Post Distribution</h2>
            <div id="positive-negative-pie-chart">
              <Chart options={positiveNegativePieChartOptions} series={positiveNegativeData.series} type="pie" height={450} />
            </div>
          </div>
        </div>
      </LocalizationProvider>
     ) : ( <AlertModal
            open={true}
            handleClose={handleClose}
            title="Token Expired"
            content="Do you want to refresh session?"
            />
          )}
          {!isLoggedIn && isExpired && (
        <AlertModal
          open={true}
          handleClose={handleClose}
          title="Token Expired"
          content="Do you want to refresh session?"
        />
      )}
    </>
  );
};

export default CategoriesSummary;