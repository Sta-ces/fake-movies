const content = document.getElementById('content');
const filterInput = document.getElementById('filterInput');
const btnMovies = document.getElementById('showMovies');
const btnActors = document.getElementById('showActors');
const btnStudios = document.getElementById('showStudios');

let movies = [];
let actors = [];
let studios = [];
let genders = [];
let currentView = 'movies';

// Load all datas
async function loadData() {
    [movies, actors, studios, genders] = await Promise.all([
        fetch('./datas/movies.json').then(r => r.json()),
        fetch('./datas/actors.json').then(r => r.json()),
        fetch('./datas/studios.json').then(r => r.json()),
        fetch('./datas/genders.json').then(r => r.json())
    ]);
    displayMovies(movies);
}

// Display movies
function displayMovies(list) {
    content.innerHTML = '';
    list.forEach(movie => {
        const movieActors = movie.actors.map(id => {
            const actor = actors.find(a => a.id === id);
            return actor ? `${actor.firstName} ${actor.lastName}` : "Unknown";
        }).join(', ');

        const movieStudios = movie.studios.map(id => {
            const studio = studios.find(s => s.id === id);
            return studio ? studio.name : "Unknown";
        }).join(', ');

        const movieGenres = movie.genres.map(id => genders.find(g => g.id === id)?.name).join(', ');

        const div = document.createElement('div');
        div.className = 'card movie-card size-[350px] relative overflow-hidden rounded-xl';
        div.innerHTML = `
            <img src="./posters/${movie.poster}" alt="${movie.title}" class="h-full w-full absolute inset-auto object-cover z-[-1]">
            <div class="h-full flex flex-col justify-end p-6 bg-linear-to-t from-white/95 via-white/75 via-60% to-white/0 to-75%">
                <span class="text-sm text-gray italic pb-0 pt-0">${movie.year}</span>
                <h3 class="text-2xl font-bold pb-3">${movie.title}</h3>
                <p><strong>Genres:</strong> ${movieGenres}</p>
                <p><strong>Actors:</strong> ${movieActors}</p>
                <p><strong>Studio:</strong> ${movieStudios}</p>
            </div>
        `;
        content.appendChild(div);
    });
}

// Display actors
function displayActors(list) {
    content.innerHTML = '';
    list.forEach(actor => {
        const div = document.createElement('div');
        div.className = 'card actor-card';
        div.innerHTML = `
            <h3>${actor.firstName} ${actor.lastName}</h3>
            <p><strong>Born:</strong> ${actor.birthDate}</p>
            <p><strong>Gender:</strong> ${actor.gender}</p>
            <p><strong>Height:</strong> ${actor.height} cm, ${actor.weight} kg</p>
            <p><strong>Origin:</strong> ${actor.origin}</p>
            <p><strong>Languages:</strong> ${actor.languages.join(', ')}</p>
        `;
        content.appendChild(div);
    });
}

// Display studios
function displayStudios(list) {
    content.innerHTML = '';
    list.forEach(studio => {
        const div = document.createElement('div');
        div.className = 'card studio-card';
        div.innerHTML = `
            <h3>${studio.name}</h3>
            <p><strong>Founded:</strong> ${studio.creationDate}</p>
            <p><strong>Country:</strong> ${studio.country}</p>
            <p><strong>Popularity:</strong> ${studio.popularity}</p>
        `;
        content.appendChild(div);
    });
}

// Filter logic depending on current view
filterInput.addEventListener('input', () => {
    const query = filterInput.value.toLowerCase();
    if (currentView === 'movies') {
        const filtered = movies.filter(m => {
            const movieActors = m.actors.map(id => {
                const actor = actors.find(a => a.id === id);
                return actor ? `${actor.firstName} ${actor.lastName}` : "";
            }).join(', ').toLowerCase();

            const movieStudios = m.studios.map(id => {
                const studio = studios.find(s => s.id === id);
                return studio ? studio.name.toLowerCase() : "";
            }).join(', ');

            const movieGenres = m.genres.map(id => genders.find(g => g.id === id)?.name.toLowerCase()).join(', ');

            return (
                m.title.toLowerCase().includes(query) ||
                movieActors.includes(query) ||
                movieStudios.includes(query) ||
                movieGenres.includes(query)
            );
        });
        displayMovies(filtered);
    } else if (currentView === 'actors') {
        const filtered = actors.filter(a =>
            `${a.firstName} ${a.lastName}`.toLowerCase().includes(query) ||
            a.origin.toLowerCase().includes(query) ||
            a.languages.some(lang => lang.toLowerCase().includes(query))
        );
        displayActors(filtered);
    } else if (currentView === 'studios') {
        const filtered = studios.filter(s =>
            s.name.toLowerCase().includes(query) ||
            s.country.toLowerCase().includes(query)
        );
        displayStudios(filtered);
    }
});

// Navigation buttons
btnMovies.addEventListener('click', () => { currentView = 'movies'; displayMovies(movies); });
btnActors.addEventListener('click', () => { currentView = 'actors'; displayActors(actors); });
btnStudios.addEventListener('click', () => { currentView = 'studios'; displayStudios(studios); });

// Init
loadData();
