// index.js

import createImageCards from "./render-image-cards";

// import ImagesApiService from './js/images-api-service';
// import createImageCards from './js/render-image-cards';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

// const refs = {
//     searchForm: document.querySelector('.search-form'),
//     gallery: document.querySelector('.gallery'),
//     observer: document.querySelector('#observer'),
// }

// const imagesApiService = new ImagesApiService();
// let lightbox = new SimpleLightbox('.gallery a');

// refs.searchForm.addEventListener('submit', onFormSubmit);

// async function onFormSubmit(evt) {
//     evt.preventDefault();

//     imagesApiService.query = evt.currentTarget.elements.searchQuery.value;
//     // const request = refs.input.value;
//     // недоцільний варіант з огляду на можливе винесення функції в окремий файл,
//     // у випадку чого достукатись з іншого файлу до глобальної змінної refs.input буде неможливо
//     // const searchQuery = evt.currentTarget.elements.searchQuery.value;

//     if(imagesApiService.query === '') {
//         return;
//     }

//     clearGallery();
//     imagesApiService.resetPage();

//     const { data } = await imagesApiService.fetchImages();

//     if (data.hits.length === 0) {
//         Notify.failure(
//           'Sorry, there are no images matching your search query. Please try again.'
//         ),
//           { timeout: 5000 };

//         return;
//     }
    
//     Notify.info(`Hooray! We found ${data.totalHits} images.`), { timeout: 3000 };

//     createGallery(data);
// }

// function createGallery(data) {
//     let markup = data.hits.map(createImageCards).join('');
//     refs.gallery.insertAdjacentHTML('beforeend', markup);
    
//     imagesApiService.incrementPage();
//     lightbox.refresh();
// }

// function clearGallery() {
//     refs.gallery.innerHTML = '';
// }

// new SimpleLightbox(".gallery a");

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





// images-api-service.js

// export default class ImagesApiService {
//     #BASE_URL = 'https://pixabay.com/api/';
//     #KEY = '30234526-30dbaada1436fb2bf1e0a6a2b';

//     constructor() {
//         this.searchQuery = '';
//         this.page = 1;
//         this.sumImg = 0;
//     }

//     async fetchImages() {
//         const searchParams = new URLSearchParams({
//             key: this.#KEY,
//             q: this.searchQuery,
//             image_type: 'photo',
//             orientation: 'horizontal',
//             safesearch: true,
//             per_page: 40,
//             page: this.page,
//         });

//         try {
//             this.incrementSumImg()
//             return await axios.get(`${this.#BASE_URL}?${searchParams}`);
//         } catch (error) {
//             Notify.failure('ERROR'), { timeout: 3000 };
//         }
//     }

//     incrementPage() {
//         this.page += 1;
//     }

//     resetPage() {
//         this.page = 1;
//     }

//     get query() {
//         return this.searchQuery;
//     }

//     set query(newQuery) {
//         this.searchQuery = newQuery;
//     }

//     incrementSumImg() {
//         this.sumImg += 40;
//     }
    
//     resetSumImg() {
//         this.sumImg = 0;
//     }
// });








// render-image-cards.js

// export default function createImageCards({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {return`<div class="photo-card">
//                 <a class="gallery-link" href=${largeImageURL}>
//                     <div class="photo-card">
//                         <img src="${webformatURL}" alt="${tags}" loading="lazy" class="photo-card__image"/>
//                         <div class="info"> 
//                             <p class="info-item">
//                                 Likes
//                                 <b>${likes}</b>
//                             </p>
//                             <p class="info-item">
//                                 Views
//                                 <b>${views}</b>
//                             </p>
//                             <p class="info-item">
//                                 Comments
//                                 <b>${comments}</b>
//                             </p>
//                             <p class="info-item">
//                                 Downloads
//                                 <b>${downloads}</b>
//                             </p>
//                         </div>
//                     </div>
//                 </a>
//             </div>`
// }