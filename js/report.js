const issueForm = document.getElementById("issueForm");

if (issueForm) {
    issueForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const category = document.getElementById("category").value;
        const priority = document.getElementById("priority").value;
        const location = document.getElementById("location").value.trim();
        const description = document.getElementById("description").value.trim();
        const reporter = document.getElementById("reporter").value.trim();
        const contact = document.getElementById("contact").value.trim();
        const photoInput = document.getElementById("photo");
        const photoFile = photoInput.files[0];

        const issue = {
            id: "NCC-" + Date.now(),
            category: category,
            priority: priority,
            location: location,
            description: description,
            reporter: reporter,
            contact: contact,
            status: "Reported",
            date: new Date().toLocaleDateString(),
            photo: "",
            statusHistory: []
        };

        if (photoFile) {
            const reader = new FileReader();

            reader.onload = function () {
                issue.photo = reader.result;
                saveIssue(issue);
            };

            reader.onerror = function () {
                alert("The photo could not be read. Please try again.");
            };

            reader.readAsDataURL(photoFile);
        } else {
            saveIssue(issue);
        }
    });
}

function saveIssue(issue) {
    let issues = [];

    try {
        const storedIssues = localStorage.getItem("communityIssues");

        if (storedIssues) {
            const parsedIssues = JSON.parse(storedIssues);

            if (!Array.isArray(parsedIssues)) {
                alert("Saved issue data is not a valid list. Nothing was changed.");
                return;
            }

            issues = parsedIssues;
        }

        issues.push(issue);

        localStorage.setItem(
            "communityIssues",
            JSON.stringify(issues)
        );
    } catch (error) {
        alert("Could not save the report. Your existing data has not been intentionally cleared.");
        console.error("Issue save error:", error);
        return;
    }

    alert(
        "Your issue has been reported successfully!\n\n" +
        "Issue ID: " + issue.id
    );

    issueForm.reset();
}
