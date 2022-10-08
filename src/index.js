import ImagesApiService from './js/images-api-service';
import createImageCards from './js/render-image-cards';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';
import 'simplelightbox/dist/simple-lightbox.min.css';


const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    observer: document.querySelector('#observer'),
    // додаю контейнер пагінації
    pagination: document.querySelector('.tui-pagination'),
    // додаю кнопку додавання картинки до списку улюблених
    addBtn: document.querySelector('.photo-card__button'),
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

  if (data.hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    ),
      { timeout: 5000 };

    return;
  }

  Notify.info(`Hooray! We found ${data.totalHits} images.`), { timeout: 3000 };

  createDefaultGallery(data);
  console.log(data);
}

function createDefaultGallery(data) {
  let defaultMarkup = data.hits.map(createImageCards).join('');
  refs.gallery.insertAdjacentHTML('beforeend', defaultMarkup);
}

refs.pagination.addEventListener('click', renderNewPage);

async function renderNewPage() {
    if(imagesApiService.searchQuery === '') {
      clearGallery();
  
      const newCurrentPage = pagination.getCurrentPage();
      imagesApiService.setPage(newCurrentPage);
    
      const { data } = await imagesApiService.defaultFetch();
    
      createDefaultGallery(data);
    } else {
      clearGallery();

      const newCurrentPage = pagination.getCurrentPage();
      imagesApiService.setPage(newCurrentPage);

      const { data } = await imagesApiService.fetchImages();

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
    imagesApiService.resetPage();

    const { data } = await imagesApiService.fetchImages();
    pagination.setTotalItems(data.totalHits);

    console.log(data);

    if (data.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        ),
          { timeout: 5000 };

        return;
    }
    
    Notify.info(`Hooray! We found ${data.totalHits} images.`), { timeout: 3000 };

    createGallery(data);
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


// ==================== Функціонал додавання картинок до списку ==================== //


refs.addBtn.addEventListener('click', onBtnClick);

const STORAGE_KEY = "favourite-images";
const storageValues = {
};

function onBtnClick() {

}






// const onEntry = entries => {
//   entries.forEach(entry => {
//     if (entry.isIntersecting && imagesApiService.page !== 1) {
//       imagesApiService.fetchImages().then(({ data }) => {
//         if (imagesApiService.sumImg > data.totalHits) {
//           Notify.info(
//             "We're sorry, but you've reached the end of search results."
//           ),
//             { timeout: 5000 };

//           return;
//         }

//         if (data.hits.length === 0) {
//           Notify.failure(
//             'Sorry, there are no images matching your search query. Please try again.'
//           ),
//             { timeout: 5000 };

//           return;
//         }

//         createGallery(data);
//       });
//     }
//   });
// };

// const observer = new IntersectionObserver(onEntry, {
//   rootMargin: '200px',
// });
// observer.observe(refs.observer);

