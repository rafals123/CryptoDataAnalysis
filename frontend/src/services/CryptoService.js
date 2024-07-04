import axios from "axios";
import TokenService from './TokenService'
class CryptoService {
  source = "http://localhost:8080/currencies";
  cryptoTab = [];
  listeners = [];
  currentCryptoQuotes = [];
  currentExtremes = [];
  currentCryptoPosts = [];
  constructor() {
    if (!CryptoService.instance) {
      CryptoService.instance = this;
    }
    return CryptoService.instance;
  }

  async getCryptoNames() {
    if (this.cryptoTab.length === 0) {
      try {    
        const response = await axios.get(`${this.source}/getAllCryptoNames`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
          },
        })
        this.cryptoTab = response.data;
        return this.cryptoTab;
      }
      catch (error) {
        if (error.response && error.response.status === 403) {
          console.log("Access forbidden: Token might have expired");
          TokenService.setTokenExpired(true);
        } else {
          throw error; 
        }
      }
      } else {
        return this.cryptoTab;
      }
  }

  async getCryptoHistoricalQuotes(cryptoName) {
    try { 
      const response = await axios.get(`${this.source}/quotes`, {
        params: {
          cryptoName: cryptoName,
        },
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      });
      this.currentCryptoQuotes = response.data.quotes;
      this.notifyListeners();
    } catch(error) {
      if (error.response && error.response.status === 403) {
        console.log("Access forbidden: Token might have expired");
        TokenService.setTokenExpired(true);
        
      } else {
        throw error;
      }
    }
  }

  async getCryptoExtremes(cryptoName) {
    
    try { 
    const response = await axios.post(
      `${this.source}/getExtremes`,
      {
        "cryptoCurrencyName": cryptoName,
        "extremeType": 0
    },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      },
    
    );

    this.currentExtremes = response.data.Extremums;
    this.notifyListeners();
    } catch(error) {
      if (error.response && error.response.status === 403) {
        console.log("Access forbidden: Token might have expired");
        TokenService.setTokenExpired(true);
        
      } else {
        throw error;
      }
    }

  }
     
  async getCryptoPosts(cryptoName) {
    try { 
    const response = await axios.get(
      `http://localhost:8080/cryptoPosts/postsForCrypto?cryptoName=${cryptoName}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      },
    
    );
    this.currentCryptoPosts = response.data.posts;
    this.notifyListeners();
    } catch(error) {
      if (error.response && error.response.status === 403) {
        console.log("Access forbidden: Token might have expired");
        TokenService.setTokenExpired(true);
        
      } else {
        throw error; 
      }
    }
  }

     
  async getAllCryptoPosts() {
    try { 
    const response = await axios.get(
      `http://localhost:8080/cryptoPosts/allPosts`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      },
    
    );
    this.currentCryptoPosts = response.data.posts;
    this.notifyListeners();
    } catch(error) {
      if (error.response && error.response.status === 403) {
        console.log("Access forbidden: Token might have expired");
        TokenService.setTokenExpired(true);
        
      } else {
        throw error;
      }
    }
  }
  
  async addCryptoPost(postData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:8080/cryptoPosts/addPost`,
        postData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('Access forbidden: Token might have expired');
        TokenService.setTokenExpired(true);
      } else {
        throw error;
      }
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    console.log("New subscriber added. Current subscribers:", this.listeners.length);
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback);
      console.log("Subscriber removed. Current subscribers:", this.listeners.length);
    };
  }

  notifyListeners() {
    this.listeners.forEach((callback) => callback(this.currentCryptoQuotes, this.currentExtremes, this.currentCryptoPosts)); 
  }
}

const cryptoServiceInstance = new CryptoService();
export default cryptoServiceInstance;
