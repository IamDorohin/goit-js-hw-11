import axios from 'axios';

export default class ImagesApiService {
    #BASE_URL = 'https://pixabay.com/api/';
    #KEY = '30234526-30dbaada1436fb2bf1e0a6a2b';

    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.sumImg = 0;
    }

    async fetchImages() {
        const searchParams = new URLSearchParams({
            key: this.#KEY,
            q: this.searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: 40,
            page: this.page,
        });

        try {
            this.incrementSumImg()
            return await axios.get(`${this.#BASE_URL}?${searchParams}`);
        } catch (error) {
            Notify.failure('ERROR'), { timeout: 3000 };
        }
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }

    incrementSumImg() {
        this.sumImg += 40;
      }
    
      resetSumImg() {
        this.sumImg = 0;
      }
}