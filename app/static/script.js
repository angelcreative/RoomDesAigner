// Variable to store the current state of the button
let buttonProgress = 0;

// Function to change the background color of the button progressively
function changeButtonColor() {
  const button = document.querySelector(".buttonExt");
  const color = `linear-gradient(to right, #1f1f1f ${buttonProgress}%, #8A2BE2 ${buttonProgress}%)`;
  
  // Add transition properties to smoothly animate the background color change
  button.style.transition = "background 0.5s ease";
  button.style.background = color;
  
  // Increment the button progress by a certain value (adjust this value according to your needs)
  buttonProgress += 1;

  if (buttonProgress <= 100) {
    // If the progress has not reached 100%, schedule the next color update
    setTimeout(changeButtonColor, 100); // Adjust the update time according to your needs
  } else {
    // When 100% progress is reached, reset and restore the button
    buttonProgress = 0;
    button.style.background = "#1f1f1f";
    
    // Remove the transition properties after the color change is complete
    button.style.transition = "none";
  }
}



// Function to handle the form submission
function handleSubmit(event) {
  event.preventDefault();
  const fileInput = document.getElementById("imageDisplayUrl");
  const file = fileInput.files[0];

  if (file) {
    // Image file is selected
    const apiKey = "ba238be3f3764905b1bba03fc7a22e28"; // Replace with your actual API key
    const uploadUrl = "https://api.imgbb.com/1/upload";

    const formData = new FormData();
    formData.append("key", apiKey);
    formData.append("image", file);

    fetch(uploadUrl, {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Image uploaded successfully
          const imageUrl = data.data && data.data.medium && data.data.medium.url;
          const selectedValues = getSelectedValues(); // Get the selected form values
          generateImages(imageUrl, selectedValues);
        } else {
          // Image upload failed
          console.error("Image upload failed:", data.error.message);
        }
      })
      .catch(error => {
        console.error("Error uploading image:", error);
      });
  } else {
    // Image file is not selected
    const selectedValues = getSelectedValues(); // Get the selected form values
    generateImages(null, selectedValues);
  }
    
  // Update the download JSON button with the selected form values
  const selectedValues = getSelectedValues();
  updateDownloadButton(selectedValues);
}

// Function to update the download JSON button
function updateDownloadButton(selectedValues) {
  const downloadJsonButton = document.getElementById("downloadJsonButton");
  downloadJsonButton.addEventListener("click", () => {
    const jsonData = JSON.stringify(selectedValues, null, 2);
    downloadFile(jsonData, "selected_values.json");
  });
}

// Function to download the JSON file
function downloadFile(data, filename) {
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
}


// Function to get the selected form values
function getSelectedValues() {
  return {
    // Replace with your form field IDs and corresponding values
    photography_level_shot: document.getElementById("photography_level_shot").value,
    magazine: document.getElementById("magazine").value,
    design_style: document.getElementById("design_style").value,
    vendors: document.getElementById("vendors").value,
    color_palette: document.getElementById("color_palette").value,
    room_shape: document.getElementById("room_shape").value,
    size: document.getElementById("size").value,
    home_area: document.getElementById("home_area").value,
    child_room: document.getElementById("child_room").value,
    illumination: document.getElementById("illumination").value,
    doors: document.getElementById("doors").value,
    windows: document.getElementById("windows").value,
    floors: document.getElementById("floors").value,
    roofs: document.getElementById("roofs").value,
    roof_height: document.getElementById("roof_height").value,
    lenses: document.getElementById("lens_used_with_the_camera_to_take_the_shot").value,
    cameras: document.getElementById("camera_used_to_take_the_shot").value,
    imageUrl: document.getElementById("imageDisplayUrl").value
  };
}

// Function to generate images using Stable Diffusion API
function generateImages(imageUrl, selectedValues) {
  const apiKey = "X0qYOcbNktuRv1ri0A8VK1WagXs9vNjpEBLfO8SnRRQhN0iWym8pOrH1dOMw"; // Replace with your actual API key

  const prompt = {
    key: apiKey,
    prompt: JSON.stringify(selectedValues), // Use the selected form values as the prompt
    negative_prompt: "YOUR_NEGATIVE_PROMPT",
    width: "1024",
    height: "512",
    samples: "4",
    num_inference_steps: "20",
    seed: null,
    guidance_scale: 7.5,
    webhook: null,
    track_id: null,
    safety_checker: null,
    enhance_prompt: null,
    multi_lingual: null,
    panorama: null,
    self_attention: null,
    upscale: null,
    embeddings_model: null
  };

  // Set the image URL as the init_image in the prompt
  prompt.init_image = imageUrl;

  // Change the button color before making the API request
  changeButtonColor();

  // Make an API request to Stable Diffusion API with the prompt
  fetch("/generate-images", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(prompt)
  })
    .then(response => response.json())
    .then(data => {
      // Handle the API response and display the generated images
      if (data.status === "success" && data.output) {
        const imageUrls = data.output.map(url =>
          url.replace("https://d1okzptojspljx.cloudfront.net", "https://stablediffusionapi.com")
        );
        showModal(imageUrls);
        showOverlay(); // Show the overlay
      } else {
        console.error("Failed to generate images:", data.error);
      }
    })
    .catch(error => {
      console.error("Error generating images:", error);
    });
}


// Function to show the modal overlay
function showOverlay() {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "block";
}

// Function to display the generated images in a modal
function showModal(imageUrls) {
  const modal = document.getElementById("modal");
  const imageGrid = document.getElementById("imageGrid");

  // Clear previous images
  imageGrid.innerHTML = "";

  // Display the generated images
  imageUrls.forEach(imageUrl => {
    const imageContainer = document.createElement("div");

    // Create image element
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = "Generated Image";
    image.classList.add("thumbnail");

    // Create buttons container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("image-buttons");

    // Create copy URL button
    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy URL";
    copyButton.addEventListener("click", () => {
      copyImageUrlToClipboard(imageUrl);
    });

    // Create download button
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download";
    downloadButton.addEventListener("click", () => {
      downloadImage(imageUrl);
    });

    // Append buttons to buttons container
    buttonsContainer.appendChild(copyButton);
    buttonsContainer.appendChild(downloadButton);

    // Append image and buttons container to image container
    imageContainer.appendChild(image);
    imageContainer.appendChild(buttonsContainer);

    // Append image container to image grid
    imageGrid.appendChild(imageContainer);
  });

  // Show the modal
  modal.style.display = "block";
}


// Function to open the image in a new tab
function openImageInNewTab(imageUrl) {
  window.open(imageUrl, "_blank");
}


// Function to copy the image URL to clipboard
function copyImageUrlToClipboard(imageUrl) {
  const tempInput = document.createElement("input");
  tempInput.value = imageUrl;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
  alert("Image URL copied to clipboard!");
}

// Function to download the image (or open in a new tab if not possible to download)
function downloadImage(imageUrl) {
  const link = document.createElement("a");
  link.href = imageUrl;
  link.target = "_blank";

  // Check if the browser supports the "download" attribute
  if ("download" in link) {
    link.download = "generated_image.png";
    link.click();
  } else {
    // Fallback: Open the image in a new tab if download is not supported
    window.open(imageUrl, "_blank");
  }
}



// Function to close the modal
function closeModal() {
  const modal = document.getElementById("modal");
  const overlay = document.getElementById("overlay");
  modal.style.display = "none";
  overlay.style.display = "none";
}

// Function to clear all form values and reset the image display
function clearAll() {
  const fileInput = document.getElementById("imageDisplayUrl");
  fileInput.value = ""; // Clear the file input
  const form = document.getElementById("imageGenerationForm");
  form.reset(); // Reset the form to its initial state
}

// Add event listener to the form submission
const form = document.getElementById("imageGenerationForm");
form.addEventListener("submit", handleSubmit);

// Add event listener to the close button of the modal
const closeButton = document.getElementsByClassName("close")[0];
closeButton.addEventListener("click", closeModal);

// Add event listener to the "Clear All" button
const clearAllButton = document.getElementById("clearAllButton");
clearAllButton.addEventListener("click", clearAll);
