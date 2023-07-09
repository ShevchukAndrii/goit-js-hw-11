
const key = "11934457-4993f38e20ffc9cd54235e1b7";
const baseUrl = "https://pixabay.com/api/";

export function fetchPhotos(query, page, perPage) {
    return fetch(`${baseUrl}?key=${key}&q=${query}&image_type=photo&orientation=horizontal&safesearch=false&page=${page}&per_page=${perPage}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        })
}