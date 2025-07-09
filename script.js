document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('movie-search');
    const searchBtn = document.getElementById('search-btn');
    const searchResults = document.getElementById('search-results');
    const recommendations = document.getElementById('recommendations');
    const themeToggle = document.getElementById('theme-toggle');

    searchBtn.addEventListener('click', searchMovies);
    themeToggle.addEventListener('click', toggleTheme);

    function searchMovies() {
        const movieName = searchInput.value;
        if (movieName.trim() === '') return;

        fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ movie_name: movieName }),
        })
        .then(response => response.json())
        .then(data => {
            displaySearchResults(data);
        })
        .catch(error => console.error('Error:', error));
    }

    function displaySearchResults(results) {
        searchResults.innerHTML = '<h2>Search Results:</h2>';
        results.forEach(movie => {
            const movieCard = createMovieCard(movie);
            movieCard.addEventListener('click', () => getRecommendations(movie.movieId));
            searchResults.appendChild(movieCard);
        });
        searchResults.classList.remove('hidden');
        recommendations.classList.add('hidden');
    }

    function getRecommendations(movieId) {
        fetch('/recommend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ movie_id: movieId }),
        })
        .then(response => response.json())
        .then(data => {
            displayRecommendations(data);
        })
        .catch(error => console.error('Error:', error));
    }

    function displayRecommendations(results) {
        recommendations.innerHTML = '<h2>Movie Recommendations:</h2>';
        results.forEach(movie => {
            const movieCard = createMovieCard(movie);
            recommendations.appendChild(movieCard);
        });
        recommendations.classList.remove('hidden');
    }

    function createMovieCard(movie) {
        const card = document.createElement('div');
        card.className = 'movie-card fade-in';
        card.innerHTML = `
            <div class="movie-title">${movie.title}</div>
            <div class="movie-genres">${movie.genres}</div>
            ${movie.score ? `<div class="movie-score">Score: ${movie.score.toFixed(2)}</div>` : ''}
        `;
        return card;
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    }

    // Check for saved theme preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
    }
});
