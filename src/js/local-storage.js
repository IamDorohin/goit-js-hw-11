// import ImagesApiService from './images-api-service';
import createLocalStorageCards from './render-local-storage-gallery';
// import defaultPage from '../index';
import SimpleLightbox from 'simplelightbox';
import Pagination from 'tui-pagination';
// import 'tui-pagination/dist/tui-pagination.css';

const refs = {
    gallery: document.querySelector('.local-storage-gallery'),
    pagination: document.querySelector('.tui-pagination'),
    // додаю кнопку додавання картинки до списку улюблених
    // addBtn: document.querySelector('.photo-card__button'),
}

let lightbox = new SimpleLightbox('.gallery a');

// =============== Функціонал пагінації на дефолтному запиті =============== //
const options = {
  totalItems: 40,
  itemsPerPage: 4,
  visiblePages: 5,
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

const parsedData = JSON.parse(localStorage.getItem("arrayOfImages"));
const arrayOfImages = parsedData.hits;
const arrayLength = arrayOfImages.length;
const numberOfPages = arrayLength / 4;

let firstElementOfPage = 0;
let lastElementOfPage = 4;
let createdPage = arrayOfImages.slice(firstElementOfPage, lastElementOfPage);

createLocalStorageGallery(createdPage);

function createLocalStorageGallery(createdPage) {
    refs.gallery.insertAdjacentHTML('beforeend', createdPage.map(createLocalStorageCards).join(''));
}

refs.pagination.addEventListener('click', renderNewPage);

async function renderNewPage() {
    clearGallery();

    firstElementOfPage = pagination.getCurrentPage() * 4 - 4;
    lastElementOfPage = pagination.getCurrentPage() * 4;

    // console.log(pagination.getCurrentPage());
    // console.log(firstElementOfPage);
    // console.log(lastElementOfPage);

    createdPage = arrayOfImages.slice(firstElementOfPage, lastElementOfPage);
    createLocalStorageGallery(createdPage);
    // for(let i = 2; i <= numberOfPages; i+=1) {
    //     clearGallery();

    //     firstElementOfPage += 4;
    //     lastElementOfPage += 4;
    //     createdPage = arrayOfImages.slice(firstElementOfPage, lastElementOfPage);

    //     createLocalStorageGallery()
    // }
}

function clearGallery() {
    refs.gallery.innerHTML = '';
}


// 0  1  2  3		    1	-  0    4
// 4  5  6  7		    2	-  4    8
// 8  9  10  11		    3	-  8    12
// 12  13  14  15		4	-  12   16
// 16  17  18  19		5	-  16   20
// 20  21  22  23		6	-  20   24
// 24  25  26  27		7	-  24   28
// 28  29  30  31		8	-  28   32
// 32  33  34  35		9	-  32   36
// 36  37  38  39		10	-  36   40