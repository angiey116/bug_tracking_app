
const bugForm = document.getElementById("bugForm");
const bugList = document.getElementById("bugList");
const filterSeverity = document.getElementById("filterSeverity");
const filterStatus = document.getElementById("filterStatus");
const severitySuggestion = document.getElementById("severitySuggestion");
const applySuggestionButton = document.getElementById("applySuggestion");
const severitySelect = document.getElementById("severity");
const descriptionInput = document.getElementById("description");

function suggestSeverity() {
    const description = descriptionInput.value.toLowerCase();
    let suggested = "Low";

    if (
        description.includes("crash") ||
        description.includes("security") ||
        description.includes("data loss") ||
        description.includes("breach")
    ) {
        suggested = "Critical";
    } else if (
        description.includes("not working") ||
        description.includes("error") ||
        description.includes("cannot login") ||
        description.includes("failed")
    ) {
        suggested = "High";
    } else if (
        description.includes("slow") ||
        description.includes("delay") ||
        description.includes("incorrect")
    ) {
        suggested = "Medium";
    }

    severitySuggestion.textContent =
        description.trim() === ""
            ? ""
            : "Suggested Severity: " + suggested;
}

descriptionInput.addEventListener("input", suggestSeverity);

applySuggestionButton.addEventListener("click", function() {
    const suggestion = severitySuggestion.textContent;

    if (suggestion.startsWith("Suggested Severity: ")) {
        const suggestedLevel = suggestion.replace("Suggested Severity: ", "");
        severitySelect.value = suggestedLevel;
    } else {
        alert("Please enter a bug description first.");
    }
});

let bugs = JSON.parse(localStorage.getItem("bugs")) || [];

bugForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const severity = document.getElementById("severity").value;

    if (!title || !description) {
        alert("Please fill out all required fields.");
        return;
    }

    const bug = {
        id: Date.now(),
        title: title,
        description: description,
        severity: severity,
        status: "Open"
    };

    bugs.push(bug);
    localStorage.setItem("bugs", JSON.stringify(bugs));
    displayBugs();
    bugForm.reset();
});

function displayBugs() {
    bugList.innerHTML = "";

    const selectedSeverity = filterSeverity.value;
    const selectedStatus = filterStatus.value;

    const filteredBugs = bugs.filter(function(bug) {
        const matchesSeverity =
            selectedSeverity === "All" || bug.severity === selectedSeverity;

        const matchesStatus =
            selectedStatus === "All" || bug.status === selectedStatus;

        return matchesSeverity && matchesStatus;
        });
    filteredBugs.forEach(function(bug) {
        const bugCard = document.createElement("div");
        bugCard.style.backgroundColor = "white";
        bugCard.style.padding = "15px";
        bugCard.style.marginBottom = "15px";
        bugCard.style.borderRadius = "8px";

        const heading = document.createElement("h3");
        heading.textContent = bug.title;

        const description = document.createElement("p");
        description.textContent = bug.description;

        const severity = document.createElement("p");
        severity.textContent = "Severity: " + bug.severity;

        const status = document.createElement("select");

        ["Open", "In Progress", "Resolved"].forEach(function(option) {
            const choice = document.createElement("option");
            choice.value = option;
            choice.textContent = option;
            status.appendChild(choice);
        });

        status.value = bug.status;

        status.addEventListener("change", function() {
            bug.status = status.value;
            localStorage.setItem("bugs", JSON.stringify(bugs));
        });

        const editButton = document.createElement("button");
        editButton.textContent = "Edit Bug";
        editButton.style.marginTop = "10px";
        editButton.style.padding = "8px 12px";
        editButton.style.cursor = "pointer";

        editButton.addEventListener("click", function() {
            const newTitle = prompt("Edit bug title:", bug.title);

            if (newTitle === null) return;

            if (newTitle.trim() === "") {
                alert("Bug title cannot be empty.");
                return;
            }

            const newDescription = prompt("Edit bug description:", bug.description);

            if (newDescription === null) return;

            if (newDescription.trim() === "") {
                alert("Bug description cannot be empty.");
                return;
            }

            bug.title = newTitle.trim();
            bug.description = newDescription.trim();

            localStorage.setItem("bugs", JSON.stringify(bugs));
            displayBugs();
        });
        bugCard.append(heading, description, severity, status, editButton);
        bugList.appendChild(bugCard);
    });
}

displayBugs();
filterSeverity.addEventListener("change", displayBugs);
filterStatus.addEventListener("change", displayBugs);
