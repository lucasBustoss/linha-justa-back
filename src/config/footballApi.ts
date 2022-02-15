import axios from 'axios';

export default axios.create({
  baseURL: 'https://api-football-v1.p.rapidapi.com/v3/',
  headers: {
    'X-RapidAPI-Key': '24adb7a738msh2cc4661aae01c04p10b740jsna3fdf883900c',
  },
});
