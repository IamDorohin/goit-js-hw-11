export default function createImageCards({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {return `<a class="gallery-link" href=${largeImageURL}>
        <div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" class="photo-card__image"/>
            <div class="info"> 
                <p class="info-item">
                    Likes
                    <b>${likes}</b>
                </p>
                <p class="info-item">
                    Views
                    <b>${views}</b>
                </p>
                <p class="info-item">
                    Comments
                    <b>${comments}</b>
                </p>
                <p class="info-item">
                    Downloads
                    <b>${downloads}</b>
                </p>
                <button type="button" class="photo-card__button"> + ADD </button>
            </div>
        </div>
    </a>`
}