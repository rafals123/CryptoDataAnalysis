import axios from "axios";

export default class AuthService {
  source = "http://localhost:8080/auth";

  async registry(user) {
    const { first_name, last_name, email, password } = user; 
    return await axios.post(
      `${this.source}/registry`,
      {
        first_name,
        last_name,
        email,
        password
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } 
    
  async login(user) {
    const { email, password } = user; 
    return await axios.post(
      `${this.source}/login`,
      {
        email,
        password
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
