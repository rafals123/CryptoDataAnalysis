import jwt_decode from "jwt-decode";

class TokenService {
    constructor() {
        if (TokenService.instance) {
            return TokenService.instance;
        }
        
        this.TOKEN_EXPIRED = false;
        TokenService.instance = this;
    }

    setToken(token) {
        localStorage.setItem("token", token);
        this.TOKEN_EXPIRED = false;
    }

    getToken() {
        return localStorage.getItem("token");
    }

    setTokenExpired(expired) {
        this.TOKEN_EXPIRED = expired;
    }

    getTokenExpired() {
        return this.TOKEN_EXPIRED;
    }

    isLoggedIn() {
        const token = this.getToken();
        if(token !== undefined)
        {
            return token;
        }
        else return false;
    }

    async getUserRole() {
        
        const token = this.getToken();
    
        if (token) {
            try {
                const decodedToken = jwt_decode(token);
    
                if (decodedToken) {
                    const role = decodedToken.role;
                    return role;
                } else {
                    console.error('Error decoding JWT token.');
                    return null;
                }
            } catch (error) {
                console.error('Error decoding JWT token:', error);
                return null;
            }
        } else {
            console.error('Token not found.');
            return null;
        }
    }
    
   
    removeToken() {
        localStorage.removeItem("token")
    }

}
const instance = new TokenService();

export default instance;