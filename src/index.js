import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchPhotos } from "./api.js";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

let simpleLightBox = new SimpleLightbox('.gallery a');
var query = "";
var page = 1;
const perPage = 40;

const searchFormEl = document.querySelector(".search-form");
const galleryListEl = document.querySelector(".gallery");
const loadMoreBtnEl = document.querySelector('.load-more');
const inputEl = searchFormEl.firstElementChild;


function createGallery(photos) {
    const markup = photos
        .map(photo => {
            const {
                largeImageURL,
                webformatURL,
                tags,
                likes,
                views,
                comments,
                downloads,
            } = photo;
            return `<div class="photo-card">
            <a class="gallery-link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</a></div>`;
        })
        .join('');

    return markup;
}


function handleSearchFormOnSubmit(event) {
    event.preventDefault();
    query = inputEl.value.trim();
    page = 1;
    if (!query) {
    Notify.warning(
        'The search string cannot be empty.', {
            width: '300px',
            position: 'center-center',
            timeout: 3000,
        }
    );
    return;
    }
    fetchPhotos(query, page, perPage).then(data => {
        console.log(data);
        if (data.totalHits === 0) {
            Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.', {
            width: '300px',
            position: 'center-center',
            timeout: 3000,
            });
        } else {
            galleryListEl.innerHTML = createGallery(data.hits);
            simpleLightBox.refresh();
            Notify.success(`Hooray! We found ${data.totalHits} images.`, {
            width: '300px',
            position: 'center-center',
            timeout: 3000,
            });
            if (data.totalHits > perPage) {
            loadMoreBtnEl.classList.remove("is-hidden")
            }
            
           
      }
    }).catch(onFetchError).finally(() => {
        searchFormEl.reset();
    })


}

function handleMoreBtnClick() {
    page += 1;
    fetchPhotos(query, page, perPage).then(data => {
        const amountOfPages = Math.ceil(data.totalHits / perPage);
        if (page === amountOfPages) {
            loadMoreBtnEl.classList.add('is-hidden');
            Notify.failure(
          'Sorry, there are no more photos.', {
            width: '300px',
            position: 'center-center',
            timeout: 3000,
            });
            
    }
    galleryListEl.insertAdjacentHTML('beforeend', createGallery(data.hits));
    simpleLightBox.refresh();
      }
    ).catch(onFetchError)

}






searchFormEl.addEventListener("submit", handleSearchFormOnSubmit);
loadMoreBtnEl.addEventListener("click", handleMoreBtnClick)


function onFetchError(error) {
    Notify.failure('Oops! Something went wrong! Try reloading the page!', {
        position: 'center-center',
        timeout: 3000,
        width: '600px',
        fontSize: '24px',
    });
  console.log(error)
};