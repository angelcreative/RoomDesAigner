function generateImages(imageUrl, selectedValues) {
    const includeOptionalText = document.getElementById("optionalTextCheckbox").checked;
    const customText = document.getElementById("customText").value;
    const pictureSelect = document.getElementById("picture");
    const selectedPicture = pictureSelect.value;
    const promptInit = ` ${selectedPicture}, interiordesign, homedecor, architecture, homedesign, UHD`;

    let plainText = Object.entries(selectedValues)
        .filter(([key, value]) => value && key !== "imageUrl")
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");

    const promptEndy = ` interiordesign, homedecor, architecture, homedesign, UHD, ${selectedPicture}, `;
    const optionalText = includeOptionalText ? generateOptionalText() : "";
    const promptText = `${promptInit} ${plainText} ${customText} ${promptEndy} ${optionalText}`;

    showOverlay(); // Show the overlay and loading message
    showWaitingOverlay(); // Show the waiting overlay

    const apiKey = "YOUR_DALL-E_3_API_KEY"; // Replace with your actual DALL-E 3 API key
    const endpoint = "https://api.openai.com/v1/images/generate"; // DALL-E 3 endpoint

    const dallePayload = {
        prompt: promptText,
        n: 1 // Number of images to generate
        // Add other necessary parameters based on DALL-E 3 documentation
    };

    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(dallePayload)
    })
    .then(response => response.json())
    .then(data => {
        hideWaitingOverlay(); // Hide the waiting overlay

        // Process and display the generated image
        const imageUrls = data.generated_images; // Adjust this based on actual response structure
        showModal(imageUrls, promptText);
    })
    .catch(error => {
        console.error('Error:', error);
        showError(); // Function to show error in UI
    });

    // Update the chips with selected values
    const chipsSV = document.getElementById("chipsSV");
    chipsSV.innerHTML = ""; // Clear the existing content

    for (const [key, value] of Object.entries(selectedValues)) {
        if (value) {
            const formattedValue = value.replace(/_/g, " ");
            const chip = document.createElement("span");
            chip.classList.add("chipSV");

            const isHexColor = /^#[0-9A-Fa-f]{6}$/i.test(formattedValue);
            if (isHexColor) {
                chip.classList.add("hexDot");
                chip.style.backgroundColor = formattedValue;
            } else {
                chip.textContent = formattedValue;
            }

            chipsSV.appendChild(chip);
        }
    }
}

// Function to show the overlay
function showOverlay() {
    // Implementation for showing the overlay
    // ...
}

// Function to show the waiting overlay
function showWaitingOverlay() {
    // Implementation for showing the waiting overlay
    // ...
}

// Function to hide the waiting overlay
function hideWaitingOverlay() {
    // Implementation for hiding the waiting overlay
    // ...
}

// Function to process and display the generated image
function showModal(imageUrls, promptText) {
    // Implementation to show modal with the generated images
    // ...
}

// Function to show error in UI
function showError() {
    // Implementation to show error message
    // ...
}
