let votes = [];
let users = [];
let userVotes = {}; // Track user votes

// Show different pages
function showPage(pageId) {
    document.querySelectorAll('.card').forEach(page => {
        page.style.display = page.id === pageId ? "block" : "none";
    });
}

// Admin Login
function loginAdmin() {
    let username = document.getElementById("adminUsername").value;
    let password = document.getElementById("adminPassword").value;

    if (username === "admin" && password === "admin123") {
        showPage('adminPanel');
        updateLiveVotes();
    } else {
        alert("Invalid Admin Credentials");
    }
}

// User Signup
function signupUser() {
    let newUsername = document.getElementById("newUsername").value;
    let newPassword = document.getElementById("newPassword").value;

    users.push({ username: newUsername, password: newPassword });
    alert("Signup Successful!");
    showPage('loginCard');
}

// User Login
function loginUser() {
    let username = document.getElementById("userLogin").value;
    let password = document.getElementById("userPassword").value;

    let foundUser = users.find(user => user.username === username && user.password === password);
    if (foundUser) {
        sessionStorage.setItem("currentUser", username);
        showPage('voteCard');
        loadVotingOptions();
    } else {
        alert("Invalid Credentials");
    }
}

// Add voting option for admin
function addOption() {
    let optionName = document.getElementById("voteOption").value;
    if (optionName.trim() === "") {
        alert("Please enter a valid option.");
        return;
    }

    let listItem = document.createElement("li");
    listItem.innerText = optionName;
    document.getElementById("optionList").appendChild(listItem);

    document.getElementById("voteOption").value = "";
}

// Create vote for admin
function createOrUpdateVote() {
    let title = document.getElementById("voteTitle").value;
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;
    let options = [];

    document.querySelectorAll("#optionList li").forEach(item => {
        options.push({ name: item.innerText, votes: 0 });
    });

    votes.push({ title, startDate, endDate, options });
    alert("Vote Created!");
    updateLiveVotes();
}

// Update live vote count in admin panel
function updateLiveVotes() {
    let liveVotesList = document.getElementById("liveVotesList");
    liveVotesList.innerHTML = "";

    votes.forEach((vote, index) => {
        let listItem = document.createElement("li");
        let optionListHtml = vote.options.map(option => {
            return `${option.name}: ${option.votes} vote(s)`;
        }).join('<br>');
        listItem.innerHTML = `${vote.title} (Votes Counted):<br>${optionListHtml}`;
        liveVotesList.appendChild(listItem);
    });
}

// Load voting options for users
function loadVotingOptions() {
    let optionsContainer = document.getElementById("optionsContainer");
    optionsContainer.innerHTML = ''; // Clear any previous options

    // Get the latest vote
    let latestVote = votes[votes.length - 1];
    if (latestVote) {
        document.getElementById("pollQuestionText").innerText = latestVote.title;
        latestVote.options.forEach(option => {
            let optionElement = document.createElement("div");
            optionElement.innerHTML = `
                <input type="radio" name="voteOption" value="${option.name}" id="${option.name}">
                <label for="${option.name}">${option.name}</label>
            `;
            optionsContainer.appendChild(optionElement);
        });
    }
}

// Submit user vote
function submitVote() {
    let username = sessionStorage.getItem("currentUser");
    if (!username) {
        alert("Please log in to vote.");
        return;
    }

    // Check if the user has already voted
    if (userVotes[username]) {
        alert("You have already voted!");
        return;
    }

    let selectedOption = document.querySelector('input[name="voteOption"]:checked');
    if (!selectedOption) {
        alert("Please select an option.");
        return;
    }

    let latestVote = votes[votes.length - 1];
    let option = latestVote.options.find(opt => opt.name === selectedOption.value);
    option.votes += 1;

    // Record the user's vote
    userVotes[username] = selectedOption.value;

    alert("Your vote has been submitted!");
    updateLiveVotes();
}
