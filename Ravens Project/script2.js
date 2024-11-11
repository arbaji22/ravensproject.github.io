function toggleFilter() {
    const sidebar = document.getElementById('filterSidebar');
    sidebar.classList.toggle('show');
}

function toggleExpand(id) {
    const element = document.getElementById(id);
    element.classList.toggle('show');
}

let players = []; // Will hold data from the CSV file
let currentPage = "passing"; // Default page to load when opened

document.addEventListener("DOMContentLoaded", () => {
    loadCSVData(`PowerFour_${capitalize(currentPage)}_Stats_2023 - PowerFour_${capitalize(currentPage)}_Stats_2023.csv`);
    populateSortOptions(currentPage); // Populate sort options based on default page
    updateTableHeaders(currentPage); // Set headers based on default page
});

// Function to load and parse the CSV file based on page
function loadCSVData(url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n');
            const headers = rows[0].split(',').map(header => header.trim());
            players = rows.slice(1).map(row => {
                const values = row.split(',').map(value => value.trim());
                return headers.reduce((obj, header, index) => {
                    obj[header] = values[index];
                    return obj;
                }, {});
            });
            displayPlayers(players);
        })
        .catch(error => console.error('Error loading CSV file:', error));
}

function updateTableHeaders(statType) {
    const tableHead = document.querySelector("thead");
    let headers = [];

    // Define headers for each stat type
    switch (statType) {
        case "kicking":
            headers = ["Player", "Pos", "Team", "Conf", "Year", "G", "XPM", "XPA", "XP%", "FGM", "FGA", "FG%", "Pts"];
            break;
        case "passing":
            headers = ["Player", "Pos", "Team", "Conf", "Year", "G", "Cmp", "Att", "Cmp%", "Yds", "TD", "TD%", "Int", "Int%", "Y/A", "AY/A", "Y/C", "Y/G", "Rate", "Awards"];
            break;
        case "punting":
            headers = ["Player", "Pos", "Team", "Conf", "Year", "G", "Punts", "Yds", "Avg"];
            break;
        case "receiving":
            headers = [
                "Player", "Pos", "Team", "Conf", "Year", "G", "Receiving_Rec", "Receiving_Yds", "Receiving_Avg", "Receiving_TD",
                "Rushing_Att", "Rushing_Yds", "Rushing_Avg", "Rushing_TD", "Scrimmage_Plays", "Scrimmage_Yds", "Scrimmage_Avg", "Scrimmage_TD"
            ];
            break;
        case "rushing":
            headers = [
                "Player", "Pos", "Team", "Conf", "Year", "G", "Rushing_Att", "Rushing_Yds", "Rushing_Avg", "Rushing_TD",
                "Receiving_Rec", "Receiving_Yds", "Receiving_Avg", "Receiving_TD", "Scrimmage_Plays", "Scrimmage_Yds", "Scrimmage_Avg", "Scrimmage_TD"
            ];
            break;
        case "scoring":
            headers = [
                "Player", "Pos", "Team", "Conf", "Year", "G", "Touchdowns_Rush", "Touchdowns_Rec", "Touchdowns_Int",
                "Touchdowns_FR", "Touchdowns_PR", "Touchdowns_KR", "Touchdowns_Oth", "Touchdowns_Tot",
                "Kicking_XPM", "Kicking_FGM", "Other_2PM", "Other_Sfty", "Pts"
            ];
            break;
    }

    // Update the table header with the appropriate columns
    tableHead.innerHTML = "<tr>" + headers.map(header => `<th>${header}</th>`).join("") + "</tr>";
}


// Function to display players in the table
function displayPlayers(playersList) {
    const tableBody = document.getElementById("player-table-body");
    const headers = document.querySelector("thead tr").children; // Get the current headers in the table

    tableBody.innerHTML = ""; // Clear existing table rows

    playersList.forEach(player => {
        const row = document.createElement("tr");
        row.innerHTML = Array.from(headers).map(header => {
            const headerText = header.textContent;
            return `<td>${player[headerText] || ''}</td>`;
        }).join('');
        tableBody.appendChild(row);
    });
}

// Function to populate sort options based on current statistics page
function populateSortOptions(statType) {
    const sortSelect = document.getElementById("sortOptions");
    sortSelect.innerHTML = ""; // Clear existing options

    let sortOptions = [];

    // Define sort options for each stat type
    switch (statType) {
        case "kicking":
            sortOptions = ["Player", "School", "Conf", "Year", "G", "XPM", "XPA", "XP%", "FGM", "FGA", "FG%", "Pts"];
            break;
        case "passing":
            sortOptions = ["Player", "Team", "Conf", "Year", "G", "Cmp", "Att", "Cmp%", "Yds", "TD", "TD%", "Int", "Int%", "Y/A", "AY/A", "Y/C", "Y/G", "Rate"];
            break;
        case "punting":
            sortOptions = ["Player", "School", "Conf", "Year", "G", "Punts", "Yds", "Avg"];
            break;
        case "receiving":
            sortOptions = ["Player", "School", "Conf", "Year", "G", "Receiving_Rec", "Receiving_Yds", "Receiving_Avg", "Receiving_TD"];
            break;
        case "rushing":
            sortOptions = ["Player", "School", "Conf", "Year", "G", "Rushing_Att", "Rushing_Yds", "Rushing_Avg", "Rushing_TD"];
            break;
        case "scoring":
            sortOptions = ["Player", "School", "Conf", "Year", "G", "Touchdowns", "Kicking_XPM", "Kicking_FGM", "Pts"];
            break;
    }

    // Populate the select dropdown with the appropriate sort options
    sortOptions.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        sortSelect.appendChild(opt);
    });
}

// Function to apply sorting
function applySort() {
    const sortKey = document.getElementById("sortOptions").value;
    const sortOrder = document.getElementById("sortOrder").value;
    
    players.sort((a, b) => {
        if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
        if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
        return 0;
    });
    
    displayPlayers(players);
}

// Event listeners for buttons to load specific stats
document.querySelector(".stat-button:nth-child(1)").addEventListener("click", () => loadStatPage("kicking"));
document.querySelector(".stat-button:nth-child(2)").addEventListener("click", () => loadStatPage("passing"));
document.querySelector(".stat-button:nth-child(3)").addEventListener("click", () => loadStatPage("punting"));
document.querySelector(".stat-button:nth-child(4)").addEventListener("click", () => loadStatPage("receiving"));
document.querySelector(".stat-button:nth-child(5)").addEventListener("click", () => loadStatPage("rushing"));
document.querySelector(".stat-button:nth-child(6)").addEventListener("click", () => loadStatPage("scoring"));

// Function to load a specific statistics page
function loadStatPage(statType) {
    currentPage = statType;
    loadCSVData(`PowerFour_${capitalize(statType)}_Stats_2023.csv`);
    populateSortOptions(statType); // Update sort options for the selected page
    updateTableHeaders(statType); // Update table headers for the selected page
}

// Helper function to capitalize the first letter of a word
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

// Select all stat buttons
const statButtons = document.querySelectorAll(".stat-button");

// Function to load a specific statistics page
function loadStatPage(statType) {
    currentPage = statType;
    loadCSVData(`PowerFour_${capitalize(statType)}_Stats_2023 - PowerFour_${capitalize(statType)}_Stats_2023.csv`);
    populateSortOptions(statType); // Update sort options for the selected page
    updateTableHeaders(statType);  // Update headers for the selected stat page
    setActiveButton(statType);     // Set the active button
}

// Function to set the active button
function setActiveButton(statType) {
    // Remove active class from all buttons
    statButtons.forEach(button => button.classList.remove("active"));
    
    // Find the button corresponding to the selected statType and add the active class
    const activeButton = document.querySelector(`.stat-button[data-stat="${statType}"]`);
    if (activeButton) {
        activeButton.classList.add("active");
    }
}

// Add event listeners to all stat buttons
statButtons.forEach(button => {
    const statType = button.getAttribute("data-stat");
    button.addEventListener("click", () => loadStatPage(statType));
});

// Function to search for a player and display in the table
function searchPlayer() {
    const searchInput = document.getElementById("search-bar").value.toLowerCase();
    const tableBody = document.getElementById("player-table-body");

    // If there is no search input, display all players
    if (searchInput === "") {
        displayPlayers(players);
        return;
    }

    // Filter players by name based on the search input
    const foundPlayers = players.filter(player => player.Player.toLowerCase().includes(searchInput));

    // Display the filtered players or show a message if no players are found
    if (foundPlayers.length > 0) {
        displayPlayers(foundPlayers); // Display found players
    } else {
        tableBody.innerHTML = `
            <tr>
                <td colspan="${Object.keys(players[0]).length}" style="text-align: center;">No player found with that name.</td>
            </tr>
        `;
    }
}

function applyFilters() {
    // Get selected filter values
    const selectedConferences = [...document.querySelectorAll("input[name='conference']:checked")].map(el => el.value);
    const selectedTeams = [...document.querySelectorAll("input[name='team']:checked")].map(el => el.value);
    const selectedPositions = [...document.querySelectorAll("input[name='position']:checked")].map(el => el.value);

    // Debugging: Display selected values
    console.log("Selected Conferences:", selectedConferences);
    console.log("Selected Teams:", selectedTeams);
    console.log("Selected Positions:", selectedPositions);

    // Check if players array has data
    if (!players.length) {
        console.error("No player data loaded. Check if CSV is loaded correctly.");
        return;
    }

    // Filter the players based on the selected filters
    const filteredPlayers = players.filter(player => {
        const matchesConference = selectedConferences.length === 0 || selectedConferences.includes(player.Conf.trim());
        const matchesTeam = selectedTeams.length === 0 || selectedTeams.includes(player.Team.trim());
        const matchesPosition = selectedPositions.length === 0 || selectedPositions.includes(player.Pos ? player.Pos.trim() : "");

        // Debugging: Show each player's match status
        console.log(`Player: ${player.Player}, Matches Conference: ${matchesConference}, Matches Team: ${matchesTeam}, Matches Position: ${matchesPosition}`);

        return matchesConference && matchesTeam && matchesPosition;
    });

    // Debugging: Check filtered results count
    console.log(`Filtered players count: ${filteredPlayers.length}`);

    // Display the filtered players in the table
    displayPlayers(filteredPlayers);
}

// Function to reset filters
function resetFilters() {
    document.querySelectorAll("input[type='checkbox']").forEach(el => el.checked = false);
    displayPlayers(players); // Display all players
}
