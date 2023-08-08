fetch("/generate-images", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(prompt)  // Changed payload to prompt
})
.then(response => {
    if (!response.ok) {
        throw new Error(`Error with status ${response.status}`);
    }
    return response.json();
})
.then(data => {
    if (data.status === "success" && data.output) {
        const imageUrls = data.output.map(url => url.replace("https://d1okzptojspljx.cloudfront.net", "https://stablediffusionapi.com"));
        showModal(imageUrls, promptText); // Display the images
        hideOverlay();
    } else {
        throw new Error("Error generating images");
    }
})
.catch(error => {
    console.error(error);
    displayErrorModal();
    hideOverlay();
});

// Function to display the error modal window
function displayErrorModal() {
    const errorModal = document.getElementById("errorGenerating");
    errorModal.style.display = "block";

  

    const closeButton = document.querySelector("#errorGenerating .closeError");
    closeButton.addEventListener("click", () => {
        errorModal.style.display = "none";
    });
}
