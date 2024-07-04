import React, { useState, useEffect, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import dayjs from 'dayjs';
import cryptoService from '../../services/CryptoService';
import Button from "@mui/material/Button";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TokenService from '../../services/TokenService';
import AlertModal from '../../components/AlertModals/AlertModal';
import { useNavigate } from 'react-router-dom';
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ExportToCSVModal from '../../components/AlertModals/ExportToCSVModal';
import ExportToXMLModal from '../../components/AlertModals/ExportToXMLModal';

const CandlestickChart = ({ chartData, options }) => {
  const [series, setSeries] = useState([{ name: 'candle', data: [] }]);

  useEffect(() => {
    setSeries([{ name: 'candle', data: chartData }]);
  }, [chartData]);

  return (
    <ReactApexChart options={options} series={series} type="candlestick" height={350} />
  );
};

function MainChart() {
  const [options, setOptions] = useState({
    chart: {
      height: 350,
      type: 'candlestick',
      zoom: {
        enabled: false
      }
    },
    annotations: {
      xaxis: []
    },
    tooltip: {
      enabled: true
    },
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: function (val) {
          return dayjs(val).format('MMM DD YYYY');
        }
      }
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    }
  });
  const [currentQuotes, setCurrentQuotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [cryptoExtremes, setCryptoExtremes] = useState([]);
  const [cryptoPosts, setCryptoPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [postPage, setPostPage] = useState(0);
  const [visibleDataIndexes, setVisibleDataIndexes] = useState([]);
  const pageSize = 100;
  const postsPerPage = 4;
  const navigate = useNavigate();
  const [isExpired, setIsExpired] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCryptoChosen, setIsCryptoChosen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isXmlModalOpen, setIsXmlModalOpen] = useState(false);

  const handleOpenCsvModal = () => {
    setIsCsvModalOpen(true);
  };

  const handleOpenXmlModal = () => {
    setIsXmlModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsCsvModalOpen(false);
    setIsXmlModalOpen(false);
  };

  const handleClose = () => {
    TokenService.removeToken();
    setIsExpired(false);
    TokenService.setTokenExpired(false);
    navigate('/login');
  };

  useEffect(() => {
    const subscription = (newQuotes, newExtremes, newPosts) => {
      setCurrentQuotes(newQuotes);
      setCryptoExtremes(newExtremes);
      setCryptoPosts(newPosts);
      setIsCryptoChosen(true);
    };

    const unsubscribe = cryptoService.subscribe(subscription);
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const checkTokenExpired = () => {
      setIsLoggedIn(TokenService.isLoggedIn());
      setIsExpired(TokenService.getTokenExpired());
    };

    checkTokenExpired();
    const interval = setInterval(checkTokenExpired, 1000);
    return () => clearInterval(interval);
  }, []);

  const chartData = useMemo(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = Math.min(startIndex + pageSize, currentQuotes.length);
    return currentQuotes.slice(startIndex, endIndex).map(c => ({
      x: new Date(c.dateTime).getTime(),
      y: [c.open_price, c.high_price, c.low_price, c.close_price]
    }));
  }, [currentQuotes, currentPage]);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const updateVisibleDataIndexes = () => {
    const startIndex = currentPage * pageSize;
    const endIndex = Math.min(startIndex + pageSize, currentQuotes.length);
    setVisibleDataIndexes([startIndex, endIndex]);
  };

  useEffect(() => {
    updateVisibleDataIndexes();
  }, [currentPage, currentQuotes]);

  useEffect(() => {
    if (chartData.length > 0) {
      const startDate = chartData[0].x;
      const endDate = chartData[chartData.length - 1].x;
      const filtered = cryptoPosts.filter(post => {
        const postDate = new Date(post.date).getTime();
        return postDate >= startDate && postDate <= endDate;
      });
      setFilteredPosts(filtered);
      setPostPage(0);
    }
  }, [chartData, cryptoPosts]);

  useEffect(() => {
    const visiblePosts = filteredPosts.slice(postPage * postsPerPage, (postPage + 1) * postsPerPage);
    const updatedOptions = {
      ...options,
      annotations: {
        xaxis: visiblePosts.map(post => ({
          x: new Date(post.date).getTime(),
          borderColor: '#9e7818',
          strokeDashArray: 10,
          label: {
            borderColor: '#9e7818',
            style: {
              fontSize: '10px',
              color: '#9e7818',
              background: '#9e7818'
            },
            orientation: 'horizontal',
            offsetY: 0,
            text: '-'
          }
        }))
      },
      yaxis: {
        ...options.yaxis,
        labels: {
          formatter: function (val) {
            return val.toFixed(2);
          }
        }
      }
    };
    setOptions(updatedOptions);
  }, [filteredPosts, postPage]);

  const paginatedPosts = useMemo(() => {
    const startIndex = postPage * postsPerPage;
    const endIndex = Math.min(startIndex + postsPerPage, filteredPosts.length);
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, postPage]);

  return (
    <>
      {isLoggedIn && !isExpired && (
        isCryptoChosen ? (
          <>
            <CandlestickChart chartData={chartData} options={options} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mx: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, ml: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentQuotes.length <= (currentPage + 1) * pageSize}
                >
                  Next
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, ml: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleOpenCsvModal}
                  sx={{ mr: 2 }}
                >
                  Export to CSV
                </Button>

                <Button
                  variant="contained"
                  onClick={handleOpenXmlModal}
                  sx={{ mr: 2 }}
                >
                  Export posts to XML
                </Button>
              </Box>
            </Box>

            <ExportToCSVModal
              open={isCsvModalOpen}
              handleClose={handleCloseModals}
              currentQuotes={currentQuotes}
            />
            <ExportToXMLModal
              open={isXmlModalOpen}
              handleClose={handleCloseModals}
              cryptoPosts={cryptoPosts}
            />
          </>
        ) : (
          <Typography variant="h5" align="center">
            In the menu on the left, top side of the screen, choose a cryptocurrency to display the chart.
          </Typography>
        )
      )}

      {isLoggedIn && isExpired && (
        <AlertModal
          open={isExpired}
          handleClose={handleClose}
          title="Token Expired"
          content="Do you want to refresh session?"
        />
      )}

      {filteredPosts.length > 0 && (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              width: '100%',
              mt: 2
            }}
          >
            <IconButton
              sx={{ position: 'absolute', left: 0 }}
              onClick={() => setPostPage(postPage - 1)}
              disabled={postPage === 0}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'nowrap',
                justifyContent: 'center',
                gap: 2,
                overflow: 'hidden',
                width: '100%'
              }}
            >
              {paginatedPosts.map((post) => (
                <Card key={post.id} sx={{ maxWidth: 345, margin: '20px auto' }}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" align="center">
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Category: {post.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Date: {post.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Positive: {post.positive ? "Yes" : "No"}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Link href={post.link} target="_blank" rel="noopener noreferrer">
                      Read more
                    </Link>
                  </CardActions>
                </Card>
              ))}
            </Box>
            <IconButton
              sx={{ position: 'absolute', right: 0 }}
              onClick={() => setPostPage(postPage + 1)}
              disabled={filteredPosts.length <= (postPage + 1) * postsPerPage}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>
        </>
      )}
    </>
  );
}

export default MainChart;
