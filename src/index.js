import ImagesApiService from './js/images-api-service';
import createImageCards from './js/render-image-cards';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Pagination from 'tui-pagination';
// import 'tui-pagination/dist/tui-pagination.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    observer: document.querySelector('#observer'),
    pagination: document.querySelector('.tui-pagination'),
}

const imagesApiService = new ImagesApiService();
let lightbox = new SimpleLightbox('.gallery a');

// =============== Функціонал пагінації на дефолтному запиті =============== //
const options = {
  totalItems: 100,
  itemsPerPage: 40,
  visiblePages: 10,
  page: 1,
  centerAlign: true,
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
  template: {
    page: '<a href="#" class="tui-page-btn">{{page}}</a>',
    currentPage: '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
    moveButton:
      '<a href="#" class="tui-page-btn tui-{{type}}">' +
        '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</a>',
    disabledMoveButton:
      '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
      '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</span>',
    // 
    moreButton:
      '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
      '<span class="tui-ico-ellip">...</span>' +
      '</a>'
  }
};

const pagination = new Pagination(refs.pagination, options);

defaultPage();

async function defaultPage() {
  const { data } = await imagesApiService.defaultFetch();

  pagination.setTotalItems(data.totalHits);
  localStorage.setItem("arrayOfImages", JSON.stringify(data));

  if (data.hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    ),
      { timeout: 5000 };

    return;
  }

  Notify.info(`Hooray! We found ${data.totalHits} images.`), { timeout: 3000 };

  createDefaultGallery(data);
}

function createDefaultGallery(data) {
  let defaultMarkup = data.hits.map(createImageCards).join('');
  refs.gallery.insertAdjacentHTML('beforeend', defaultMarkup);
}

refs.pagination.addEventListener('click', renderNewPage);

async function renderNewPage() {
    if(imagesApiService.searchQuery === '') {
      clearGallery();
      localStorage.clear();
  
      const newCurrentPage = pagination.getCurrentPage();

      imagesApiService.setPage(newCurrentPage);
    
      const { data } = await imagesApiService.defaultFetch();
      localStorage.setItem("arrayOfImages", JSON.stringify(data));

      createDefaultGallery(data);
    } else {
      clearGallery();
      localStorage.clear();

      const newCurrentPage = pagination.getCurrentPage();
      imagesApiService.setPage(newCurrentPage);
      const { data } = await imagesApiService.fetchImages();

      localStorage.setItem("arrayOfImages", JSON.stringify(data));

      createGallery(data);
    }
}



// =========================================================  //


refs.searchForm.addEventListener('submit', onFormSubmit);

async function onFormSubmit(evt) {
    evt.preventDefault();

    imagesApiService.query = evt.currentTarget.elements.searchQuery.value;
    // const request = refs.input.value;
    // недоцільний варіант з огляду на можливе винесення функції в окремий файл,
    // у випадку чого достукатись з іншого файлу до глобальної змінної refs.input буде неможливо
    // const searchQuery = evt.currentTarget.elements.searchQuery.value;

    if(imagesApiService.query === '') {
        return;
    }

    pagination.reset();
    clearGallery();
    localStorage.clear();
    imagesApiService.resetPage();

    const { data } = await imagesApiService.fetchImages();

    console.log(data);

    if (data.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        ),
          { timeout: 5000 };

        return;
    }
    
    Notify.info(`Hooray! We found ${data.totalHits} images.`
        ),
          { timeout: 5000 };

    createGallery(data);
    pagination.setTotalItems(data.totalHits);
    localStorage.setItem("arrayOfImages", JSON.stringify(data));
}

function createGallery(data) {
    let markup = data.hits.map(createImageCards).join('');
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    
    imagesApiService.incrementPage();
    lightbox.refresh();
}

function clearGallery() {
    refs.gallery.innerHTML = '';
}

new SimpleLightbox(".gallery a");



