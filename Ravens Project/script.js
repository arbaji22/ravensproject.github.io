function toggleFilter() {
    const sidebar = document.getElementById('filterSidebar');
    sidebar.classList.toggle('show');
}

function toggleExpand(id) {
    const element = document.getElementById(id);
    element.classList.toggle('show');
}

let players = []; // Will hold data from the CSV file

// Load CSV data on page load
document.addEventListener("DOMContentLoaded", () => {
    loadCSVData('PowerFour_Rosters_2023_Final - PowerFour_Rosters_2023_Final (1).csv'); // Update with your CSV file path
});

// Function to load and parse the CSV file
function loadCSVData(url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n');
            players = rows.slice(1).map(row => {
                const [name, jersey, pos, height, weight, yr, age, highSchool, rating, team, conference] = row.split(',').map(value => value.trim());
                return { name, jersey, pos, height, weight, yr, age, highSchool, rating, team, conference };
            });
            displayPlayers(players); // Display all players initially
        })
        .catch(error => console.error('Error loading CSV file:', error));
}

// Function to display players in the table
function displayPlayers(playersList) {
    const tableBody = document.getElementById("player-table-body");
    tableBody.innerHTML = ""; // Clear existing table rows

    playersList.forEach(player => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${player.name}</td>
            <td>${player.jersey}</td>
            <td>${player.pos}</td>
            <td>${player.height}</td>
            <td>${player.weight}</td>
            <td>${player.yr}</td>
            <td>${player.age}</td>
            <td>${player.highSchool}</td>
            <td>${player.rating}</td>
            <td>${player.team}</td>
            <td>${player.conference}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to search for a player and display in the table
function searchPlayer() {
    const searchInput = document.getElementById("search-bar").value.toLowerCase();
    const tableBody = document.getElementById("player-table-body");
    tableBody.innerHTML = ""; // Clear previous results

    if (searchInput) {
        // Find player(s) by name
        const foundPlayers = players.filter(player => player.name.toLowerCase().includes(searchInput));

        if (foundPlayers.length > 0) {
            displayPlayers(foundPlayers); // Display found players
        } else {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="11" style="text-align: center;">No player found with that name.</td>
                </tr>
            `;
        }
    } else {
        displayPlayers(players); // Display all players if search input is empty
    }
}

// Function to apply filters based on selected conference and position checkboxes
function applyFilters() {
    const selectedConferences = [...document.querySelectorAll("input[name='conference']:checked")].map(el => el.value);
    const selectedTeams = [...document.querySelectorAll("input[name='team']:checked")].map(el => el.value);
    const selectedPositions = [...document.querySelectorAll("input[name='position']:checked")].map(el => el.value);

    // Log selected filters for debugging
    console.log("Selected Conferences:", selectedConferences);
    console.log("Selected Teams:", selectedTeams);
    console.log("Selected Positions:", selectedPositions);

    // Filter players based on selected conferences, teams, and positions
    const filteredPlayers = players.filter(player => {
        const matchesConference = selectedConferences.length === 0 || selectedConferences.includes(player.conference);
        const matchesTeam = selectedTeams.length === 0 || selectedTeams.includes(player.team);
        const matchesPosition = selectedPositions.length === 0 || selectedPositions.includes(player.pos);

        return matchesConference && matchesTeam && matchesPosition;
    });

    // Log filtered players to verify filtering
    console.log("Filtered Players:", filteredPlayers);

    displayPlayers(filteredPlayers);
}

// Function to reset filters
function resetFilters() {
    document.querySelectorAll("input[type='checkbox']").forEach(el => el.checked = false);
    displayPlayers(players); // Display all players
}

// Event listeners for the filter buttons
document.querySelector(".apply-filters").addEventListener("click", applyFilters);
document.querySelector(".reset-filters").addEventListener("click", resetFilters);

// Initial display of all players
displayPlayers(players);

function applySort() {
    const sortKey = document.getElementById("sortOptions").value;
    const sortOrder = document.getElementById("sortOrder").value;

    players.sort((a, b) => {
        // Convert values to numbers for numeric sorting
        const valueA = isNaN(a[sortKey]) ? a[sortKey] : Number(a[sortKey]);
        const valueB = isNaN(b[sortKey]) ? b[sortKey] : Number(b[sortKey]);

        if (sortOrder === "asc") {
            return valueA > valueB ? 1 : -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });

    displayPlayers(players); // Refresh the table with sorted players
}

document.querySelector(".apply-sort").addEventListener("click", applySort);