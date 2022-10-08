export default function createLocalStorageCards({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {return`<div class="local-card">
        <a class="local-gallery-link" href=${largeImageURL}>
            <img src="${webformatURL}" alt="${tags}" loading="lazy" class="local-card__image"/>
        </a>
        <div class="local-info"> 
            <p class="local-info-item">
                Likes
                <b>${likes}</b>
            </p>
            <p class="local-info-item">
                Views
                <b>${views}</b>
            </p>
            <p class="local-info-item">
                Comments
                <b>${comments}</b>
            </p>
            <p class="local-info-item">
                Downloads
                <b>${downloads}</b>
            </p>
            <button type="button" class="local-card__button"> + ADD </button>
        </div>
    </div>`
}