let form = document.getElementById('form');
let searchInput = document.getElementById('search');
let resultsContainer = document.getElementById('results');
let paginationContainer = document.getElementById('pagination');


async function searchSongs(searchText) {
    let api = await fetch(`https://api.lyrics.ovh/suggest/${searchText}`);
    let data = await api.json();
    showData(data);
};

function showData(data){
    resultsContainer.innerHTML = `
        <ul class="songs">
            ${data.data.map(song => {
                return`
                    <li>
                        <span>${song.artist.name} - ${song.title}</span>
                        <button class="btn" data-artist="${song.artist.name}" data-title="${song.title}">Search Lyrics</button>
                    </li>
                `
            }).join('')}
        </ul>
    `;

    if(data.next || data.prev){
        paginationContainer.innerHTML = `
            ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
            ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ''}
        `;
    }else{
        paginationContainer.innerHTML = '';
    };
};

async function getMoreSongs(url) {
    let api = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    let data = await api.json();
    showData(data);
};

async function getLyrics(artist,title) {
    let api = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);
    let data = await api.json();
    let lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g,"</br>");
    resultsContainer.innerHTML = `
        <h2>${artist} - ${title}</h2>
        <p>${lyrics}</p>
    `;
    paginationContainer.innerHTML = "";
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let searchText = searchInput.value.trim();
    if(searchText){
        searchSongs(searchText);
    }else{
        alert('please Enter a valid search');
    }
});

resultsContainer.addEventListener('click', (e) => {
    let clickedElement = e.target;
    if(clickedElement.tagName === 'BUTTON'){
        let artist = clickedElement.getAttribute('data-artist');
        let title = clickedElement.getAttribute('data-title');
        getLyrics(artist,title);
    };
});