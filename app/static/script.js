// Function to hide the waiting overlay and loading message 
// Function to show the overlay
function showOverlay() {
  const overlay = document.getElementById("overlay"); 
  overlay.style.display = "block";
}
// Function to hide the overlay
function hideOverlay() {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "none";
}
// Example usage when "Make the Magic" button is clicked
const magicButton = document.getElementById("magicButton"); 

// modal P
//document.getElementById('password-form').addEventListener('submit', function(event)  {
//    event.preventDefault();
//
//    var passwordInput = document.getElementById('password');
//    var errorMessage = document.getElementById('error-message');
//
//    if (passwordInput.value === '4yVd4nt3') {
//        // Password is correct, close the modal or perform desired actions
//        var modalP = document.querySelector('.modalP');
//        modalP.style.display = 'none';
//    } else {
//        // Password is incorrect, display error message
//        errorMessage.textContent = 'Invalid password. Schedule a call.';
//    }
//});

//end modal P

document.addEventListener("DOMContentLoaded", function() {


//AIDESIGN
// Predefined attributes for randomness
const attributes = {
    room_size: ['small', 'medium', 'large'],
    color_scheme: ['analogous', 'triadic', 'complementary', 'square'],
    furniture_color: ['analogous', 'triadic', 'complementary', 'square'],
    room_type: ['living room', 'bedroom', 'kitchen', 'poolside', 'balcony', 'gazebo', 'mudroom', 'dining room'],
    wall_type: ['painted', 'wallpaper', 'tiled']
};

// Mixing attributes function
function mixAttributes(baseAttributes) {
    const mixedAttributes = {...baseAttributes};
    Object.keys(attributes).forEach(key => {
        // 50% chance to swap
        if (Math.random() > 0.5) {
            mixedAttributes[key] = attributes[key][Math.floor(Math.random() * attributes[key].length)];
        }
    });
    return mixedAttributes;
}

// Event listener for the "AI Design" button
document.getElementById('aiDesignButton').addEventListener('click', function() {
    const baseValues = getSelectedValues(); // Get current form values
    const mixedValues = mixAttributes(baseValues);
    console.log("Mixed Values for Generation:", mixedValues);
    generateImages(null, mixedValues, false); // Assuming generateImages handles the image generation logic
});

    
    
    
document.addEventListener("DOMContentLoaded", function() {
    // AIDESIGN
    // Predefined attributes for randomness
    const attributes = {
        room_size: ['small', 'medium', 'large'],
        color_scheme: ['analogous', 'triadic', 'complementary', 'square'],
        furniture_color: ['analogous', 'triadic', 'complementary', 'square'],
        room_type: ['living room', 'bedroom', 'kitchen', 'poolside', 'balcony', 'gazebo', 'mudroom', 'dining room'],
        wall_type: ['painted', 'wallpaper', 'tiled']
    };

    // Mixing attributes function
    function mixAttributes(baseAttributes) {
        const mixedAttributes = { ...baseAttributes };
        Object.keys(attributes).forEach(key => {
            // 50% chance to swap
            if (Math.random() > 0.5) {
                mixedAttributes[key] = attributes[key][Math.floor(Math.random() * attributes[key].length)];
            }
        });
        return mixedAttributes;
    }

    // Event listener for the "AI Design" button
    document.getElementById('aiDesignButton').addEventListener('click', function() {
        const baseValues = getSelectedValues(); // Get current form values
        const mixedValues = mixAttributes(baseValues);
        console.log("Mixed Values for Generation:", mixedValues);
        generateImages(null, mixedValues, false); // Assuming generateImages handles the image generation logic
    });

    // Function to handle the form submission
    function handleSubmit(event) {
        event.preventDefault();
        const magicButton = document.getElementById("magicButton");
        magicButton.disabled = false;
        showOverlay();

        const fileInput = document.getElementById("imageDisplayUrl");
        const file = fileInput.files[0]; // Asegúrate de obtener el primer archivo si está presente
        const selectedValues = getSelectedValues();
        const isImg2Img = Boolean(file); // Determina si se usa img2img basado en la presencia de un archivo

        if (file) {
            // Procesa la subida de la imagen a imgbb si se seleccionó un archivo
            const apiKey = "ba238be3f3764905b1bba03fc7a22e28"; // Clave API de imgbb
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
                        // Si la imagen se subió con éxito, obtén la URL y procede con img2img
                        const imageUrl = data.data.url;
                        generateImages(imageUrl, selectedValues, isImg2Img);
                    } else {
                        throw new Error("Image upload failed: " + data.error.message);
                    }
                })
                .catch(error => {
                    // Manejo de errores en caso de falla en la subida de la imagen
                    handleError(error.message);
                });
        } else {
            // Procesa txt2img si no se seleccionó ningún archivo
            generateImages(null, selectedValues, isImg2Img);
        }
    }

    function handleError(errorMessage) {
        console.error(errorMessage);
        const magicButton = document.getElementById("magicButton");
        magicButton.disabled = false;
        hideOverlay(); // Asegúrate de que esta función exista y oculte la interfaz de carga
        alert(errorMessage); // Opcional: muestra el mensaje de error en una alerta
    }

    // Function to get selected values
    function getSelectedValues() {
        const elementIds = [
            "person",
            "generated_artwork",
            "point_of_view",
            "color_scheme",
            "room_size",
            "home_room",
            "space_to_be_designed",
            "children_room",
            "pool",
            "landscaping_options",
            "garden",
            "room_shape",
            "inspired_by_this_interior_design_magazine",
            "furniture_provided_by_this_vendor",
            "furniture_pattern",
            "seating_upholstery_pattern",
            "designed_by_this_interior_designer",
            "designed_by_this_architect",
            "lens_used",
            "image_color",
            "photo_lighting_type",
            "illumination",
            "door",
            "windows",
            "ceiling_design",
            "roof_material",
            "roof_height",
            "wall_type",
            "wall_cladding",
            "walls_pattern",
            "exterior_finish",
            "exterior_trim_molding",
            "facade_pattern",
            "floors",
            "kitchen_layout",
            "countertop_material",
            "backsplash_design",
            "cabinet_storage_design",
            "appliance_style_finish",
            "bathroom_fixture_style",
            "bathroom_tile_design",
            "bathroom_vanity_style",
            "shower_bathtub_design",
            "bathroom_lighting_fixtures",
            "fireplace_design",
            "balcony_design",
            "material",
            "ceramic_material",
            "fabric",
            "stone_material",
            "marble_material",
            "wood_material",
            "design_style",
            "decorative_elements"
        ];

        const colorElements = [
            { id: "dominant_color", switchId: "use_colors" },
            { id: "secondary_color", switchId: "use_colors" },
            { id: "accent_color", switchId: "use_colors" },
            { id: "walls_paint_color", switchId: "use_walls_paint_color" },
            { id: "furniture_color", switchId: "use_furniture_color" }
        ];

        const values = {};

        elementIds.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                values[elementId] = element.value;
            }
        });

        colorElements.forEach(colorElement => {
            const colorInput = document.getElementById(colorElement.id);
            const colorSwitch = document.getElementById(colorElement.switchId);
            if (colorInput && colorSwitch && colorSwitch.checked) {
                values[colorElement.id] = colorInput.value;
            } else {
                values[colorElement.id] = ""; // Si el interruptor está apagado, asigna un valor vacío
            }
        });

        return values;
    }

    // Event listener for the color switches
    document.querySelectorAll('.switchContainer input[type="checkbox"]').forEach(switchElement => {
        switchElement.addEventListener('change', function () {
            const colorPickers = this.closest('.colorPickersGroup').querySelectorAll('.colorPicker');
            colorPickers.forEach(picker => {
                picker.disabled = !this.checked;
            });
        });
    });

    // Ensure color pickers are enabled/disabled on page load based on switch state
    document.querySelectorAll('.switchContainer input[type="checkbox"]').forEach(switchElement => {
        const colorPickers = switchElement.closest('.colorPickersGroup').querySelectorAll('.colorPicker');
        colorPickers.forEach(picker => {
            picker.disabled = !switchElement.checked;
        });
    });

    // Slider event listener for displaying value
    const slider = document.getElementById("strengthSlider");
    const sliderValueDisplay = document.getElementById("sliderValue");

    slider.addEventListener("input", function () {
        sliderValueDisplay.textContent = this.value;
    });

    // Function to generate the optional text
    function generateOptionalText() {
        return "(((Rounded organic shapes, rounded shapes, organic shapes)))";
    }

    // Function to generate fractal
    function generateFractalText() {
        return "(((fractal,fractality pattern details)))";
    }

    function showGeneratingImagesDialog() {
        document.getElementById('generatingImagesDialog').style.display = 'block';
        document.getElementById('dialogTitle').textContent = 'Crafting Your Vision';
    }

    function hideGeneratingImagesDialog() {
        document.getElementById('generatingImagesDialog').style.display = 'none';
    }

    function showErrorInDialog() {
        document.getElementById('dialogTitle').textContent = 'Something wrong happen when building the designs, close this window and try it again 🙏🏽';
    }

    function retryGeneration() {
        hideGeneratingImagesDialog();
        // Aquí debes llamar a la función que inicia la generación de imágenes
        generateImages();
    }

    document.getElementById('closeDialogButton').addEventListener('click', function () {
        document.getElementById('generatingImagesDialog').style.display = 'none';
    });

    // Function to generate images
    function generateImages(imageUrl, selectedValues, isImg2Img) {
        showGeneratingImagesDialog();

        const apiKey = "X0qYOcbNktuRv1ri0A8VK1WagXs9vNjpEBLfO8SnRRQhN0iWym8pOrH1dOMw"; // Reemplaza con tu clave API real
        const customText = document.getElementById("customText").value;
        const promptInit = `Create a highly detailed and professional photoshoot masterpiece. The photo should be highly defined, with soft shadows, the best quality, and a realistic, photo-realistic appearance. Ensure it is in UHD and 16k resolution, captured in RAW format. Focus on ultra detail and sharpness for a stunning, visually appealing result,`;

        let plainText = Object.entries(selectedValues)
            .filter(([key, value]) => value && key !== "imageUrl")
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");

        const promptEndy = `[multiple decorations: numerous decor items:1], [densely furnished: fully equipped:1], [stylishly streamlined: pattern details:1], `;

        const aspectRatio = document.querySelector('input[name="aspectRatio"]:checked').value;
        let width, height;

        if (aspectRatio === "landscape") {
            width = 1024;
            height = Math.round((2 / 3) * 1024);
        } else if (aspectRatio === "portrait") {
            width = Math.round((2 / 3) * 1024);
            height = 1024;
        } else if (aspectRatio === "square") {
            width = 1024;
            height = 1024;
        }

        width = Math.floor(width / 8) * 8;
        height = Math.floor(height / 8) * 8;

        const seedSwitch = document.getElementById("seedSwitch");
        const seedEnabled = seedSwitch.checked;
        const seedValue = seedEnabled ? null : "19071975";

        const optionalText = document.getElementById("optionalTextCheckbox").checked ? generateOptionalText() : "";
        const fractalText = document.getElementById("fractalTextCheckbox").checked ? generateFractalText() : "";
        const promptText = `${promptInit} ${plainText} ${customText} ${fractalText} ${promptEndy} ${optionalText}`;

        const prompt = {
            key: apiKey,
            prompt: JSON.stringify(promptText),
            negative_prompt: " (deformed iris), (deformed pupils), semi-realistic, (anime:1), text, close up, cropped, out of frame, worst quality, (((low quality))), jpeg artifacts, (ugly:1), duplicate, morbid, mutilated, ((extra fingers:1)), mutated hands, ((poorly drawn hands:1)), poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, ((extra limbs:1)), cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, (((fused fingers:1))), (too many fingers:1), long neck ",
            width: width,
            height: height,
            samples: "4",
            guidance_scale: "10",
            num_inference_steps: "40",
            seed: seedValue,
            webhook: null,
            safety_checker: false,
            track_id: null,
        };

        if (isImg2Img && imageUrl) {
            prompt.init_image = imageUrl;

            // Get the strength value from the slider
            const strengthSlider = document.getElementById("strengthSlider");
            prompt.strength = parseFloat(strengthSlider.value); // Use the slider value instead of a fixed value
        }

        // Fetch request to generate images
        fetch("/generate-images", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(prompt)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.status === "success" && data.output) {
                    const imageUrls = data.output.map(url =>
                        url.replace("https://d1okzptojspljx.cloudfront.net", "https://modelslab.com")
                    );
                    showModal(imageUrls, promptText);
                    hideGeneratingImagesDialog();
                } else if (data.status === "processing" && data.fetch_result) {
                    checkImageStatus(data.fetch_result);
                } else {
                    showError(data);
                }
            })
            .catch(error => {
                showError(error);
            });

        function checkImageStatus(fetchResultUrl) {
            fetch(fetchResultUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Include any other necessary headers, such as authorization headers if needed
                },
                // If additional data needs to be sent in the request body, include it here
                body: JSON.stringify(prompt)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'processing') {
                        setTimeout(() => checkImageStatus(fetchResultUrl), 2000); // Check again after 2 seconds
                    } else if (data.status === 'success') {
                        // Handle success
                        // You might want to call a function to process and display the images
                    } else {
                        // Handle any other statuses or errors
                        showError(data);
                    }
                })
                .catch(error => {
                    console.error('Error checking image status:', error);
                    showError(error);
                });
        }
    }

    function showError(error) {
        // Update the user interface to show the error
        console.error(error);
        alert("Error: " + error.message);
    }

    // Ensure that the following functions are defined properly without duplicates or missing closures

    // Function to show error message with dismiss button
    function showError(error) {
        console.error("Error generating images:", error);
        const processingMessageContainer = document.getElementById("processingMessageContainer");
        processingMessageContainer.innerHTML = '<p>😢 Something went wrong, try again in a moment.</p><i class="fa fa-plus-circle" id="dismissErrorButton" aria-hidden="true"></i>';
        processingMessageContainer.style.display = 'block';
        hideOverlay(); // Hide the overlay and loading message

        // Add event listener for the dismiss button
        const dismissButton = document.getElementById("dismissErrorButton");
        dismissButton.addEventListener('click', hideErrorMessage);
    }

    // Function to hide the error message
    function hideErrorMessage() {
        const processingMessageContainer = document.getElementById("processingMessageContainer");
        processingMessageContainer.style.display = 'none';
    }

    // Function to display the error modal window
    function displayErrorModal() {
        const errorModal = document.getElementById("errorGenerating");
        errorModal.style.display = "block";

        const tryAgainButton = document.getElementById("errorButton");
        tryAgainButton.addEventListener("click", () => {
            errorModal.style.display = "none";
            generateImages(imageUrl, selectedValues); // Relaunch the query
        });

        const closeButton = document.querySelector("#errorGenerating .closeError");
        closeButton.addEventListener("click", () => {
            errorModal.style.display = "none";
        });
    }

    // Function to reroll the images
    function rerollImages() {
        const selectedValues = getSelectedValues();
        const thumbnailImage = document.getElementById('thumbnail');

        // Check if an image has been uploaded by examining the 'src' of the thumbnail
        let imageUrl = null;
        if (thumbnailImage && thumbnailImage.src && !thumbnailImage.src.includes('blob:')) {
            imageUrl = thumbnailImage.src;
        }

        // Call generateImages with the imageUrl (null if no image uploaded)
        generateImages(imageUrl, selectedValues);
    }

    // Modify the event listener for the reroll button
    const rerollButton = document.getElementById("rerollButton");
    rerollButton.addEventListener("click", rerollImages);

    // Function to generate message
    function generateMessageDiv(message) {
        var messageDiv = document.createElement('div');
        messageDiv.id = 'message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <img class="imgLoader" src="/static/img/modal_img/copyurl.svg">
                <p class="message-microcopy">${message}</p>
                <button class="message-close-btn" onclick="closeMessage()">Close</button>
            </div>
        `;
        document.body.appendChild(messageDiv);
    }

    window.closeMessage = function () {
        var messageDiv = document.getElementById('message');
        if (messageDiv) {
            messageDiv.remove();
        }
    }

    // Function to copy text to clipboard
    async function copyTextToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            generateMessageDiv("Prompt copied to clipboard!");
        } catch (err) {
            console.error('Failed to copy: ', err);
            generateMessageDiv("Failed to copy prompt to clipboard.");
        }
    }

    // Function to open Photopea with the specified image
    function openPhotopeaWithImage(imageUrl) {
        const photopeaUrl = `https://www.photopea.com#`;
        const photopeaConfig = {
            files: [imageUrl]
        };
        const encodedConfig = encodeURIComponent(JSON.stringify(photopeaConfig));
        window.open(photopeaUrl + encodedConfig, '_blank');
    }

    // Helper function to create a button and attach an event listener
    function createButton(text, onClickHandler) {
        const button = document.createElement("button");
        button.textContent = text;
        button.addEventListener("click", onClickHandler);
        return button;
    }

    // Function to toggle the visibility of the prompt details
    function toggleContent() {
        const contentDiv = document.querySelector(".toggle-content");
        if (contentDiv) {
            if (contentDiv.style.display === "none" || contentDiv.style.display === "") {
                contentDiv.style.display = "block";
            } else {
                contentDiv.style.display = "none";
            }
        } else {
            console.error("Toggle content div not found.");
        }
    }

    // Displays modal with generated images and associated action buttons
    function showModal(imageUrls, transformedPrompt) {
        const modal = document.getElementById("modal");
        const closeButton = modal.querySelector(".close");

        closeButton.removeEventListener("click", closeModalHandler);
        closeButton.addEventListener("click", closeModalHandler);

        const thumbnailImage = document.getElementById("thumbnail");
        const userImageBase64 = thumbnailImage.src;

        const imageGrid = document.getElementById("imageGrid");
        imageGrid.innerHTML = "";

        imageUrls.forEach(imageUrl => {
            const imageContainer = document.createElement("div");
            const image = document.createElement("img");
            image.src = imageUrl;
            image.alt = "Generated Image";
            image.classList.add("thumbnail");

            const buttonsContainer = document.createElement("div");
            buttonsContainer.classList.add("image-buttons");

            const downloadButton = createButton("Download", () => downloadImage(imageUrl));
            const copyButton = createButton("Copy URL", () => copyImageUrlToClipboard(imageUrl));
            const editButton = createButton("Edit in Photopea", () => openPhotopeaWithImage(imageUrl));
            const copyPromptButton = createButton("Copy Prompt", () => copyTextToClipboard(transformedPrompt)); // Use transformedPrompt here
            const upscaleButton = createButton("Upscale", () => upscaleImage(imageUrl));
            const compareButton = createButton("Compare", () => openComparisonWindow(userImageBase64, imageUrl));

            [downloadButton, copyButton, editButton, copyPromptButton, upscaleButton, compareButton].forEach(button => buttonsContainer.appendChild(button));

            imageContainer.appendChild(image);
            imageContainer.appendChild(buttonsContainer);
            imageGrid.appendChild(imageContainer);
        });

        // Update the toggle-content div with the transformed prompt
        const toggleContentDiv = document.querySelector(".toggle-content");
        if (toggleContentDiv) {
            toggleContentDiv.innerHTML = transformedPrompt;
        } else {
            console.error("Toggle content div not found.");
        }

        modal.style.display = "block";
        showOverlay();
    }

    // Function to handle the "Close" action of modal
    function closeModalHandler() {
        const modal = document.getElementById("modal");
        modal.style.display = "none";
    }

    // Function to show overlay during modal display
    function showOverlay() {
        const overlay = document.getElementById("overlay");
        overlay.style.display = "block";
    }

    // Function to open the image in a new tab
    function openImageInNewTab(imageUrl) {
        window.open(generatedImageUrl, "_blank");
    }

    // Green dot
    function toggleGreenDot(selectId) {
        var selectElement = document.getElementById(selectId);
        var dotElement = document.querySelector('#' + selectId + '+ span.dot');
        if (selectElement.value === '') {
            dotElement.style.display = 'none';
        } else {
            dotElement.style.display = 'block';
        }
    }

    // Attach event listeners to all select elements
    var selectElements = document.querySelectorAll('select');
    selectElements.forEach(function (selectElement) {
        selectElement.addEventListener('change', function () {
            var selectId = this.id;
            toggleGreenDot(selectId);
        });
    });

    // Function to reset form
    function resetFormAndEventListeners() {
        // Reset form values
        const form = document.getElementById("imageGenerationForm");
        form.reset();

        // Remove event listeners from select elements
        const selectElements = document.querySelectorAll("select");
        selectElements.forEach(function (select) {
            select.removeEventListener("change", handleSelectChange);
        });

        // Add event listeners back to select elements
        selectElements.forEach(function (select) {
            select.addEventListener("change", handleSelectChange);
        });
    }

    function downloadImage(imageUrl) {
        console.log("Opening image in new tab:", imageUrl); // Debugging log
        window.open(imageUrl, "_blank");
    }

    // Function to close the modal
    function closeModal() {
        const modal = document.getElementById("modal");
        const overlay = document.getElementById("overlay");
        modal.style.display = "none";
        overlay.style.display = "none";
        // Enable the "Make the Magic" button
        const magicButton = document.getElementById("magicButton");
        magicButton.disabled = false;
        // Reset the form and event listeners
        // resetFormAndEventListeners();
    }

    // Function to clear all form values and reset the image display
    function clearAll(event) {
        /*event.preventDefault(); // Prevent form submission
        const fileInput = document.getElementById("imageDisplayUrl");
        fileInput.value = ""; // Clear the file input*/
        const form = document.getElementById("imageGenerationForm");
        form.reset(); // Reset the form
        // Hide all green dots
        const selectElements = document.querySelectorAll('select');
        selectElements.forEach(function (selectElement) {
            const dotElement = document.querySelector('#' + selectElement.id + '+ span.dot');
            dotElement.style.display = 'none';
        });
        // Enable the "Make the Magic" button
        const magicButton = document.getElementById("magicButton");
        magicButton.disabled = false;
        // Reset the form and event listeners
        resetFormAndEventListeners();
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
});

// Ensure other necessary event listeners are set up correctly
document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("imageDisplayUrl");
    const thumbnailContainer = document.querySelector(".thumbImg");
    const thumbnailImage = document.getElementById("thumbnail");

    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                thumbnailImage.src = e.target.result;
                thumbnailContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    const selectElements = document.querySelectorAll("select");

    // Function to check if all select options have empty values
    function areAllOptionsEmpty() {
        for (const select of selectElements) {
            if (select.value !== "") {
                return false; // At least one option has a non-empty value
            }
        }
        return true; // All options have empty values
    }

    // Function to handle changes in select elements
    function handleSelectChange() {
        const allOptionsEmpty = areAllOptionsEmpty();
        magicButton.disabled = allOptionsEmpty; // Disable magicButton if all options have empty values
    }

    // Listen for changes in select elements
    for (const select of selectElements) {
        select.addEventListener("change", handleSelectChange);
    }

    // Initial check on page load
    handleSelectChange();

    window.addEventListener('load', function () {
        setTimeout(function () {
            var splash = document.getElementById('splash');
            var content = document.getElementById('content');

            splash.style.transition = 'top 0.5s ease-in-out'; // Add transition effect
            splash.style.top = '-100%'; // Move the splash screen to the top

            setTimeout(function () {
                splash.style.display = 'none'; // Hide the splash screen
                // content.style.display = 'block'; // Show the website content
            }, 500); // Wait for the transition to complete (0.5 seconds)
        }, 4000); // 4 seconds (4000 milliseconds)
    });

    document.getElementById('clearImg').addEventListener('click', function () {
        clearImage();

        // Reset the file input
        document.getElementById('imageDisplayUrl').value = '';
    });

    function clearImage() {
        // Reset the src attribute of the thumbnail image
        var thumbnail = document.getElementById('thumbnail');
        thumbnail.src = '';

        // Hide the thumbnail container
        var thumbContainer = document.querySelector('.thumbImg');
        thumbContainer.style.display = 'none';
    }

    function displayThumbnail(imageSrc) {
        var thumbnail = document.getElementById('thumbnail');
        var thumbDiv = document.querySelector('.thumbImg');
        thumbnail.src = imageSrc;
        thumbDiv.style.display = 'block';
    }

    function clearThumbnail() {
        var thumbnail = document.getElementById('thumbnail');
        var thumbDiv = document.querySelector('.thumbImg');
        thumbnail.src = '';
        thumbDiv.style.display = 'none';
    }

    document.getElementById('imageDisplayUrl').addEventListener('change', handleImageUpload);

    // Event listener for opening the lightbox when the avatar is clicked
    document.getElementById('avatar').addEventListener('click', function () {
        document.getElementById('avatarLightbox').style.display = 'block';
    });

    // Event listener for closing the lightbox
    document.querySelector('.closeAvatar').addEventListener('click', function () {
        document.getElementById('avatarLightbox').style.display = 'none';
    });

    // Event listener for changing the avatar when a new one is selected
    document.querySelectorAll('.avatar-option input[type="radio"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
            if (this.checked) {
                // Update the src of the main avatar image
                document.getElementById('avatar').src = this.nextElementSibling.src;

                // Optionally, close the lightbox after selection
                document.getElementById('avatarLightbox').style.display = 'none';
            }
        });
    });
});
