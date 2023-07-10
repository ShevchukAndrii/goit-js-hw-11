import axios from 'axios';
const key = "11934457-4993f38e20ffc9cd54235e1b7";
const baseUrl = "https://pixabay.com/api/";

export async function fetchPhotos(query, page, perPage) {
    const response = await axios.get(`${baseUrl}?key=${key}&q=${query}&image_type=photo&orientation=horizontal&safesearch=false&page=${page}&per_page=${perPage}`)
        return response.data;
        }
