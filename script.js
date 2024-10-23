const clientId = '075c6efc16ac4ea9ba4d93d3883e7058'; // Replace with your Spotify Client ID
const redirectUri = 'http://localhost:3000/callback'; // Your redirect URI
let accessToken;

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultsDiv = document.getElementById('results');

// Authentication
function authenticate() {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=user-read-private user-read-email`;
    window.location.href = authUrl;
}

// Parse access token from URL
function getAccessToken() {
    const hash = window.location.hash;
    if (hash) {
        accessToken = hash.split('&')[0].split('=')[1];
        window.location.hash = '';
    } else {
        authenticate();
    }
}

// Search for tracks
function searchTracks(query) {
    const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`;
    
    fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayResults(data.tracks.items);
    })
    .catch(error => {
        console.error('Error fetching tracks:', error);
    });
}

// Display search results
function displayResults(tracks) {
    resultsDiv.innerHTML = '';
    if (tracks.length > 0) {
        tracks.forEach(track => {
            const trackDiv = document.createElement('div');
            trackDiv.innerHTML = `
                <strong>${track.name}</strong> by ${track.artists.map(artist => artist.name).join(', ')}
                <br>
                <audio controls>
                    <source src="${track.preview_url}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
                <hr>
            `;
            resultsDiv.appendChild(trackDiv);
        });
    } else {
        resultsDiv.textContent = 'No results found.';
    }
}

// Event listener for the search button
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchTracks(query);
    }
});

// Initialize the app
getAccessToken();
