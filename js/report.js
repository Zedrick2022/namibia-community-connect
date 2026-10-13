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
    if (!photoFile.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
    }

    if (photoFile.size > 5 * 1024 * 1024) {
        alert("This photo is larger than 5 MB. Please choose a smaller image.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function () {
        if (typeof reader.result !== "string") {
            alert("The photo could not be processed. Please try another image.");
            return;
        }

        issue.photo = reader.result;
        saveIssue(issue);
    };

    reader.onerror = function () {
        console.error("Photo reading failed:", reader.error);
        alert(
            "The browser could not read this photo. " +
            "Try another JPG or PNG image."
        );
    };

    reader.onabort = function () {
        alert("Photo reading was cancelled. Please select the photo again.");
    };

    try {
        reader.readAsDataURL(photoFile);
    } catch (error) {
        console.error("Photo reading error:", error);
        alert("Unable to open this photo. Please try another image.");
    }
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
