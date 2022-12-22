import axios from 'axios';
const API_KEY = '31421615-58a7222c9d48eda492d3b64ac';
axios.defaults.baseURL = 'https://pixabay.com/api';
axios.defaults.params = {
  orientation: 'landscape',
  per_page: 12,
  image_type: 'photo',
};
export const getImages = async (query, page) => {
  const { data } = await axios.get(`/?q=${query}&page=${page}&key=${API_KEY}`);

  return data;
};
