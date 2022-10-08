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
    // додай контейнер пагінації
    pagination: document.querySelector('.tui-pagination'),
    // додаю кнопку додавання картинки до списку улюблених
    // addBtn: document.querySelector('.photo-card__button'),
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

// ======================================================================= Виклич функцію, що запускає процес фетча даних. 

defaultPage();

async function defaultPage() {
// У мене API створена за допомогою класа,
// тому я першим рядком запускаю процес фетча даних з бекенда defaultFetch() свого класу imagesApiService (const { data } = await imagesApiService.defaultFetch())
// Тобі просто треба запустити свою функцію фетча
  const { data } = await imagesApiService.defaultFetch();

// В options налаштуваннях pagination загальна кількість даних зазначена мною по дефолту як 100
// Ти за допомогою метода pagination.setTotalItems визначаєш загальну кількість отриманих картинок по загальній кількості з отриманих фетчем даних totalHits
  pagination.setTotalItems(data.totalHits);

  // if (data.hits.length === 0) {
  //   Notify.failure(
  //     'Sorry, there are no images matching your search query. Please try again.'
  //   ),
  //     { timeout: 5000 };

  //   return;
  // }

  // Notify.info(`Hooray! We found ${data.totalHits} images.`), { timeout: 3000 };

  // Запускаєш функцію відмалювання галереї, яка має отримати результати фетча. У мене це - data. Виклич свою функцію замість неї
  createDefaultGallery(data);
  // console.log(data);
}

// Сама функція відмалювання. Встав замість неї свою.
function createDefaultGallery(data) {
  let defaultMarkup = data.hits.map(createImageCards).join('');
  refs.gallery.insertAdjacentHTML('beforeend', defaultMarkup);
}

// Повісь прослуховування події на клік по елементам пагінації
refs.pagination.addEventListener('click', renderNewPage);

// Функція, що запускається по результату кліка по елементам пагінації   
async function renderNewPage() {
    // Перевірка. Якщо пошуковий рядок пустий, то просто далі гортаємо сторінки дефолтного запиту
    if(imagesApiService.searchQuery === '') {
      // Функція очистки галереї перед малюванням нової
      clearGallery();
  
      // Отримуємо значення сторінки пагінації, на яку тільки но клікнули
      const newCurrentPage = pagination.getCurrentPage();

      // Додай до своїх функцій фетча функцію, що змінить пошуковий параметр page на значення тільки но натиснутої кнопки пагінації,
      // щоб при запиті нової сторінки відбувся запит саме номеру сторінки, який ти вибрав
      imagesApiService.setPage(newCurrentPage);
    
      // Після цього повтори фетч даних, що здійснився при 
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

