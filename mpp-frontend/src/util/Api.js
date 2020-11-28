import axios from 'axios';

export default axios.create({
  baseURL: "http://g-axon.work/jwtauth/api",
  headers: {
    'Content-Type': 'application/json',
  }
});
