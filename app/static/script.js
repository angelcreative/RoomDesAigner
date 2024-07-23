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

document.addEventListener("DOMContentLoaded", function() {

    // Predefined attributes for randomness
    const attributes = {
        room_size: ['small', 'medium', 'large'],
        color_scheme: ['analogous', 'triadic', 'complementary', 'square'],
        furniture_color: ['analogous', 'triadic', 'complementary', 'square'],
        room_type: ['living room', 'bedroom', 'kitchen', 'poolside', 'balcony', 'gazebo', 'mudroom', 'dining room'],
        wall_type: ['colored', 'wallpaper', 'tiled']
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

    // Attach handleSubmit only to the form
    const form = document.getElementById("imageGenerationForm");
    if (form) {
        form.addEventListener("submit", handleSubmit);
    }

    // Asegurarse de que solo los botones relevantes disparen la generación de imágenes
    document.getElementById('aiDesignButton').addEventListener('click', function() {
        const baseValues = getSelectedValues(); // Get current form values
        const mixedValues = mixAttributes(baseValues);
        console.log("Mixed Values for Generation:", mixedValues);
        generateImages(null, mixedValues, false); // Assuming generateImages handles the image generation logic
    });

    document.getElementById('magicButton').addEventListener('click', function() {
        form.submit();
    });

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
            "person_photography_type",
            "home_room",
            "design_style",
            "generated_artwork",
            "point_of_view",
            "color_scheme",
            "room_size",
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
            "decorative_elements"
        ];

        const values = {};

        elementIds.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                values[elementId] = element.value;
            }
        });

        return values;
    }

    // Event listener for the color switches
    document.querySelectorAll('.switchContainer input[type="checkbox"]').forEach(switchElement => {
        switchElement.addEventListener('change', function() {
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

    slider.addEventListener("input", function() {
        sliderValueDisplay.textContent = this.value;
    });

    // Function to generate the optional text
    function generateOptionalText() {
        return "Architecture and furniture with rounded and organic shapes. Highlight smooth, flowing forms in modern, minimalist designs. Include elements such as rounded walls, curved facades, and organically shaped windows in architecture, and round tables, curved sofas, and organically inspired chairs in furniture. Use soft, natural lighting to emphasize textures and curves.";
    }

    //Function to generate fractal
    function generateFractalText() {
        return "Architecture and furniture with fractal patterns and details. Highlight intricate, repeating patterns that exhibit fractal and self-similar qualities. Use modern, minimalist designs.";
    }

    function showGeneratingImagesDialog() {
        document.getElementById('generatingImagesDialog').style.display = 'block';
        document.getElementById('dialogTitle').innerHTML = `
            
            <h2 id="changingText">painting walls</h2>
            <p>Sit back and relax, your design will be ready in less than 120 seconds.</p>
             <p id="chronometer">00:00:00</p>
        `;

        const changingMessages = [
           'painting walls', 'furnishing room', 'choosing decoration', 
        'adding plants', 'hanging lamps', 'placing furniture', 
        'adjusting lighting', 'selecting colors', 'arranging art', 
        'organizing shelves', 'setting the table', 'tidying up', 
        'adding textures', 'installing hardware', 'finishing touches', 
        'polishing surfaces', 'applying finishes', 'arranging flowers', 
        'laying carpets', 'curating books', 'mounting frames', 
        'setting up tech', 'installing curtains', 'hanging mirrors',
        'refinishing floors', 'installing lighting fixtures', 'choosing fabrics',
        'updating hardware', 'placing rugs', 'installing shelves',
        'mounting TVs', 'cleaning windows', 'arranging pillows', 
        'painting trim', 'hanging blinds', 'decorating with candles',
        'adding greenery', 'staging furniture', 'setting up appliances',
        'installing art', 'organizing pantry', 'decorating walls', 
        'designing layout', 'setting up workspace', 'choosing flooring',
        'placing decor items', 'organizing closet', 'setting up entertainment system',
        'arranging outdoor furniture'
        ];

        let chronometerInterval;
        let textChangeInterval;

        function resetChronometer() {
            clearInterval(chronometerInterval);
            const chronometer = document.getElementById('chronometer');
            let milliseconds = 0;

            chronometer.textContent = '00:00:00';

            chronometerInterval = setInterval(() => {
                milliseconds += 10;
                const minutes = Math.floor((milliseconds / 1000) / 60);
                const seconds = Math.floor((milliseconds / 1000) % 60);
                const displayMilliseconds = Math.floor((milliseconds % 1000) / 10);
                chronometer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${displayMilliseconds.toString().padStart(2, '0')}`;
            }, 10);
        }

        function changeText() {
            let index = 0;
            const changingText = document.getElementById('changingText');
            
            changingText.textContent = changingMessages[index];

            clearInterval(textChangeInterval);

            textChangeInterval = setInterval(() => {
                index = (index + 1) % changingMessages.length;
                changingText.textContent = changingMessages[index];
            }, 4000);
        }

        resetChronometer();
        changeText();
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

    document.getElementById('closeDialogButton').addEventListener('click', function() {
        document.getElementById('generatingImagesDialog').style.display = 'none';
    });

    function showErrorInDialog() {
        document.getElementById('dialogTitle').textContent = 'Something wrong happen when building the designs, close this window and try it again 🙏🏽';
    }

    function generateImages(imageUrl, selectedValues, isImg2Img) {
        showGeneratingImagesDialog();

        const apiKey = "X0qYOcbNktuRv1ri0A8VK1WagXs9vNjpEBLfO8SnRRQhN0iWym8pOrH1dOMw"; // Reemplaza con tu clave API real
        const customText = document.getElementById("customText").value;
        const pictureSelect = document.getElementById("imageDisplayUrl");
        const selectedPicture = pictureSelect.value;
        const promptInit = `Sharp focus, RAW, unedited, symmetrical balance, in-frame,  hyperrealistic, highly detailed,  stunningly beautiful, intricate, (professionally color graded), ((bright soft diffused light)), HDR, 35mm film photography Unedited 8K photograph .`;

        let plainText = Object.entries(selectedValues)
            .filter(([key, value]) => value && key !== "imageUrl")
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");

        const promptEndy = `dense furnishings and decorations.`;

        const aspectRatio = document.querySelector('input[name="aspectRatio"]:checked').value;

        let width, height;

        if (aspectRatio === "landscape") { // 3:2 aspect ratio
            width = 1080;
            height = Math.round((2 / 3) * 1080);  
        } else if (aspectRatio === "portrait") { // 2:3 aspect ratio
            width = Math.round((2 / 3) * 1080);  
            height = 1080;
        } else if (aspectRatio === "square") { // 1:1 aspect ratio
            width = 1080;
            height = 1080;
        }

        console.log(`Width: ${width}, Height: ${height}`);

        const seedSwitch = document.getElementById("seedSwitch");
        const seedEnabled = seedSwitch.checked;
        const seedValue = seedEnabled ? null : "19071975";

        const optionalText = document.getElementById("optionalTextCheckbox").checked ? generateOptionalText() : "";
        const fractalText = document.getElementById("fractalTextCheckbox").checked ? generateFractalText() : "";
        const promptText = `${promptInit} ${plainText} ${customText} ${fractalText} ${promptEndy} ${optionalText}`;

        // Determine the model_id based on the selection of the "person" field
        const personValue = document.getElementById("personModel").value;
        const furnitureValue = document.getElementById("furnitureModel").value;

        // Determine if the person model or furniture model should be used
        let modelId = "ae-sdxl-v1"; // Default to ae-sdxl-v1

        if (personValue !== "") {
            modelId = personValue;
        } else if (furnitureValue !== "") {
            modelId = furnitureValue;
        }

        // Initialize variables for LoRA model and strength
        let lora = "clothingadjustloraap";
        let lora_strength = 1;

        // Conditionally set the LoRA model based on the selected model
        if (modelId === personValue) {
            lora = "clothingadjustloraap,open-lingerie-lora,perfect-round-ass-olaz,xl_more_enhancer";
        } else if (modelId === furnitureValue) {
            lora = "clothingadjustloraap,xl_more_enhancer";
        }

        const prompt = {
            key: apiKey,
            prompt: promptText,
            negative_prompt: "multiple people, two persons, duplicate, cloned face, extra arms, extra legs, extra limbs, multiple faces, deformed face, deformed hands, deformed limbs, mutated hands, poorly drawn face, disfigured, long neck, fused fingers, split image, bad anatomy, bad proportions, ugly, blurry, text, low quality",
            width: width,
            height: height,
            samples: 4,
            guidance_scale: 5,
            steps: 41,
            use_karras_sigmas: "yes",
            tomesd: "yes",
            seed: seedValue,
            model_id: modelId,
            lora_model: lora,
            lora_strength: lora_strength,
            scheduler: "DPMSolverMultistepScheduler",
            webhook: null,
            safety_checker: "no",
            track_id: null,
            enhance_prompt: "no",
        };

        if (isImg2Img && imageUrl) {
            prompt.init_image = imageUrl;

            // Get the strength value from the slider
            const strengthSlider = document.getElementById("strengthSlider");
            prompt.strength = parseFloat(strengthSlider.value); // Use the slider value instead of a fixed value
        }

        async function fetchWithRetry(url, options, retries = 3, delay = 20000) {
            for (let i = 0; i < retries; i++) {
                try {
                    const response = await fetch(url, options);
                    if (response.ok) {
                        return response.json();  // Directly return the parsed JSON
                    } else if (response.status >= 500 && response.status < 600) {
                        console.warn(`Server error (status: ${response.status}). Retrying... (${i + 1}/${retries})`);
                    } else {
                        const errorResponse = await response.json();
                        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorResponse.message}`);
                    }
                } catch (error) {
                    console.error(`Fetch attempt ${i + 1} failed: ${error.message}`);
                    if (i === retries - 1) {
                        throw error;
                    }
                }
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        fetch("/generate-images", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(prompt)
        })
        .then(response => {
            if (!response.ok) {
                if (response.status >= 500 && response.status < 600) {
                    // En caso de error 500, pasa directamente a checkImageStatus
                    return response.json().then(data => {
                        if (data.fetch_result) {
                            checkImageStatus(data.fetch_result, data.transformed_prompt);
                            throw new Error(`Image generation in progress. Checking status...`);
                        } else {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                    }).catch(() => {
                        // Manejar el caso donde response.json() falla
                        checkImageStatus("/check-status-url", ""); // Usa un URL de estado genérico si es necesario
                        throw new Error(`Image generation in progress. Checking status...`);
                    });
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "success" && data.output) {
                const imageUrls = data.output.map(url =>
                    url.replace("https://d1okzptojspljx.cloudfront.net", "https://modelslab.com")
                );
                showModal(imageUrls, data.transformed_prompt);  // Display images
                hideGeneratingImagesDialog();  // Hide any loading dialogs
            } else if (data.status === "processing" && data.fetch_result) {
                checkImageStatus(data.fetch_result, data.transformed_prompt);  // Continue checking status if processing
            } else {
                showError(data);  // Show error if other statuses are encountered
            }
        })
        .catch(error => {
            if (!error.message.includes("Image generation in progress")) {
                showError(error);  // Catch and display errors from the fetch operation or JSON parsing
            }
        });

        function checkImageStatus(fetchResultUrl, transformedPrompt) {
            fetch(fetchResultUrl, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(prompt)
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'processing') {
                    if (data.eta) {
                        document.getElementById('etaValue').textContent = data.eta;
                    }
                    setTimeout(() => checkImageStatus(fetchResultUrl, transformedPrompt), 5000); // Check again after 5 seconds
                } else if (data.status === "success" && data.output) {
                    const imageUrls = data.output.map(url =>
                        url.replace("https://d1okzptojspljx.cloudfront.net", "https://modelslab.com")
                    );
                    showModal(imageUrls, transformedPrompt);  // Display images
                    hideGeneratingImagesDialog();  // Hide any loading dialogs
                } else {
                    showError(data);
                }
            })
            .catch(error => {
                console.error('Error checking image status:', error);
                showError(error);
            });
        }

        function showError(error) {
            // Update the user interface to show the error
            console.error(error);
            alert("Error: " + error.message);
        }

        function displayImages(images) {
            // Function to display images or handle the successful completion of the task
            console.log('Displaying images:', images);
        }

        function showError(error) {
            console.error("Error generating images:", error);
            const processingMessageContainer = document.getElementById("processingMessageContainer");
            processingMessageContainer.innerHTML = '<p>😢 Something went wrong, try again in a moment.</p><i class="fa fa-plus-circle" id="dismissErrorButton" aria-hidden="true"></i>';
            processingMessageContainer.style.display = 'block';
            hideOverlay(); // Hide the overlay and loading message

            const dismissButton = document.getElementById("dismissErrorButton");
            dismissButton.addEventListener('click', hideErrorMessage);
        }

        function hideErrorMessage() {
            const processingMessageContainer = document.getElementById("processingMessageContainer");
            processingMessageContainer.style.display = 'none';
        }

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
    }

    function rerollImages() {
        const selectedValues = getSelectedValues();
        const thumbnailImage = document.getElementById('thumbnail');
        
        let imageUrl = null;
        if (thumbnailImage && thumbnailImage.src && !thumbnailImage.src.includes('blob:')) {
            imageUrl = thumbnailImage.src;
        }

        generateImages(imageUrl, selectedValues);
    }

    const rerollButton = document.getElementById("rerollButton");
    rerollButton.addEventListener("click", rerollImages);

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

    function copyTextToClipboard(text) {
        const tempInput = document.createElement("textarea");
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        
        generateMessageDiv("Prompt copied to clipboard!");
    }

    const upscaleImage = async (imageUrl) => {
        try {
            const url = 'https://image-upscale-ai-resolution-x4.p.rapidapi.com/runsync';
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': '076e563ff0msh5fffe0c2d818c0dp1b32e3jsn62452f3f696d',
                    'X-RapidAPI-Host': 'image-upscale-ai-resolution-x4.p.rapidapi.com'
                },
                body: JSON.stringify({
                    input: {
                        input_image_url: imageUrl
                    }
                })
            };

            const response = await fetch(url, options);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            if (data.output && data.output.body) {
                const body = JSON.parse(data.output.body);
                const upscaledImageUrl = body.output_image_url;

                if (upscaledImageUrl) {
                    fetch('/create-upscale-session', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            upscaledImageUrl: upscaledImageUrl
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.slug) {
                            const url = `https://roomdesaigner.onrender.com/upscale/${data.slug}`;
                            window.open(url, '_blank');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                } else {
                    console.error('No upscaled image URL found:', body);
                    alert('Failed to retrieve the upscaled image. Please check the console for more details.');
                }
            } else {
                console.error('Invalid API response structure:', data);
                alert('Failed to process the API response. Please check the console for more details.');
            }
        } catch (error) {
            console.error('Error upscaling image:', error);
            alert(`Failed to upscale image: ${error.message}`);
        }
    }

    function searchImageOnRapidAPI(imageUrl) {
        const url = 'https://real-time-lens-data.p.rapidapi.com/search';
        const params = new URLSearchParams({
            url: imageUrl,
            language: 'en',
            country: 'us'
        });

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '076e563ff0msh5fffe0c2d818c0dp1b32e3jsn62452f3f696d',
                'X-RapidAPI-Host': 'real-time-lens-data.p.rapidapi.com'
            }
        };

        fetch(`${url}?${params.toString()}`, options)
            .then(response => response.json())
            .then(data => displayResultsInNewTab(data))
            .catch(err => console.error('Error:', err));
    }

    function displayResultsInNewTab(data) {
        const newWindow = window.open('', '_blank');
        const htmlContent = `
            <html>
            <head>
                <title>Search Results</title>
                <link rel="icon" type="image/png" sizes="192x192" href="https://roomdesaigner.onrender.com/static/img/android-icon-192x192.png">
                <link rel="icon" type="image/png" sizes="32x32" href="https://roomdesaigner.onrender.com/static/img/favicon-32x32.png">
                <link rel="icon" type="image/png" sizes="96x96" href="https://roomdesaigner.onrender.com/static/img/favicon-96x96.png">
                <link rel="icon" type="image/png" sizes="16x16" href="https://roomdesaigner.onrender.com/static/img/favicon-16x16.png">
                <style>
                    html {
                        background: #15202b;
                    }
                    img.logoRD {
                        margin: 20px auto 0 auto;
                        display: block;
                        height: 50px;
                    }
                    .maskImage {
                        height: 160px;
                        display: flex;
                        align-items: flex-start;
                        justify-content: center;
                        overflow: hidden;
                        width: 200px;
                    }
                    .provider {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-direction: row;
                        font-size: 12px;
                        margin-bottom: 12px;
                    }
                    h3 {
                        padding: 10px;
                        white-space: pre-wrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        width: 160px;
                        font-weight: 300;
                        font-size: 12px;
                    }
                    h1 {
                        color: #a9fff5;
                        margin: 2rem 0;
                        font-weight: lighter;
                        text-align: center;
                        font-family: sans-serif;
                        font-size: 20px;
                    }
                    .card-container {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 20px;
                        justify-content: space-around;
                    }
                    .card {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                        width: 200px;
                        padding: 0 0 20px 0;
                        text-align: center;
                        background: #fff;
                        border-radius: 8px;
                        overflow: hidden;
                        color: #6d7b87;
                        font-family: courier;
                        font-size: 14px;
                    }
                    p {
                        text-align: center;
                        color: #6d7b87;
                        font-family: courier;
                    }
                    p a {
                        font-size:16px;
                    }
                    .card img {
                        width: 100%;
                        height: auto;
                        border-radius: 4px;
                    }
                    .source-icon {
                        width: 20px !important;
                        height: 20px !important;
                        margin-right: 4px;
                    }
                    a {
                        color: #9aabba;
                        font-size: 12px;
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
               <img class="logoRD" src="https://roomdesaigner.onrender.com/static/img/logo_web_dark.svg">
                <h1 class="headerStore">Image Search Results</h1>
                <p>For refined product search, download the desired image,<a href="https://lens.google.com/search?ep=subb&re=df&p=AbrfA8pD_XRKs4Uk9azAVO5kckRoS9BffYYqJCUAtcFI-L6CDrn-F6GbtF1ugO9JjR7NCiQx_fRUl7j7uInPEIsCAU5bqRfLb2H64GxcuUEVz04AdAl07SuomVAiFja96VxMDK3q2aahJHwPRX_eKJ6sXMkl-KxprRofgMz7dqPPewM0habspTYyyyRJyozlmT7xHPXCR5JWo8gciq0Sz6-R2xE_Y75025eluHD5o4kcf0RB6y62vkoMB1GIuRMPKvmAExpqeJ_jAvs5pwXxIiCo49Z9qnP_7g%3D%3D#lns=W251bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsIkVrY0tKR0kwTUdFek16WXpMV05oWW1JdE5EYzJaQzFpTVdJMExUQmxNbU14WVRNeFpEWTROeElmYTNwR2NHMW5NVzlsVTFsVWIwUk1aa3hPVEZCZlpWQTJhRlUwT1Rkb1p3PT0iXQ==" target="_blank"> upload it here</a> and start searching for specific products</p>

                <div class="card-container">
                    ${data.data.visual_matches.map(match => `
                        <div class="card">
                            <div class="maskImage">
                            <img src="${match.thumbnail}" alt="Thumbnail">
                            </div>
                            <h3 class="cardTitle">${match.title}</h3>
                            <div class="provider"><img class="source-icon" src="${match.source_icon}" alt="Source Icon">  <p>${match.source}</p></div>
                           
                            <a href="${match.link}" target="_blank">Visit product</a>
                        </div>
                    `).join('')}
                </div>
            </body>
            </html>
        `;
        newWindow.document.write(htmlContent);
        newWindow.document.close();
    }

    function openComparisonWindow(userImageBase64, generatedImageUrl) {
        fetch('/create-comparison-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userImageBase64: userImageBase64,
                generatedImageUrl: generatedImageUrl
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.slug) {
                const url = `https://roomdesaigner.onrender.com/compare/${data.slug}`;
                window.open(url, '_blank');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function copyImageUrlToClipboard(imageUrl) {
        const tempInput = document.createElement("textarea");
        tempInput.value = imageUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        
        generateMessageDiv("Image URL copied to clipboard!");
    }

    function openPhotopeaWithImage(imageUrl) {
        const photopeaUrl = `https://www.photopea.com/#${encodeURIComponent(imageUrl)}`;
        window.open(photopeaUrl, '_blank');
    }

    function createButton(text, onClickHandler) {
        const button = document.createElement("button");
        button.textContent = text;
        button.addEventListener("click", onClickHandler);
        return button;
    }

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

            const downloadButton = createButton("Download", (event) => {
                event.stopPropagation();
                event.preventDefault();
                downloadImage(imageUrl);
            });
            const copyButton = createButton("Copy URL", (event) => {
                event.stopPropagation();
                event.preventDefault();
                copyImageUrlToClipboard(imageUrl);
            });
            const editButton = createButton("Edit in Photopea", (event) => {
                event.stopPropagation();
                event.preventDefault();
                openPhotopeaWithImage(imageUrl);
            });
            const copyPromptButton = createButton("Copy Prompt", (event) => {
                event.stopPropagation();
                event.preventDefault();
                copyTextToClipboard(transformedPrompt);
            });
            const upscaleButton = createButton("Upscale", (event) => {
                event.stopPropagation();
                event.preventDefault();
                upscaleImage(imageUrl);
            });
            const compareButton = createButton("Compare", (event) => {
                event.stopPropagation();
                event.preventDefault();
                openComparisonWindow(userImageBase64, imageUrl);
            });

            [downloadButton, copyButton, editButton, copyPromptButton, upscaleButton, compareButton].forEach(button => buttonsContainer.appendChild(button));

            imageContainer.appendChild(image);
            imageContainer.appendChild(buttonsContainer);
            imageGrid.appendChild(imageContainer);
        });

        const toggleContentDiv = document.querySelector(".toggle-content");
        if (toggleContentDiv) {
            toggleContentDiv.innerHTML = transformedPrompt;
        } else {
            console.error("Toggle content div not found.");
        }
        
        modal.style.display = "block";
        showOverlay();
    }

    function closeModalHandler() {
        const modal = document.getElementById("modal");
        modal.style.display = "none";
    }

    function downloadImage(imageUrl) {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function closeModal() {
        const modal = document.getElementById("modal");
        const overlay = document.getElementById("overlay");
        modal.style.display = "none";
        overlay.style.display = "none";
        const magicButton = document.getElementById("magicButton");
        magicButton.disabled = false;
    }

    function clearAll(event) {
        const form = document.getElementById("imageGenerationForm");
        form.reset();
        const selectElements = document.querySelectorAll('select');
        selectElements.forEach(function(selectElement) {
            const dotElement = document.querySelector('#' + selectElement.id + '+ span.dot');
            dotElement.style.display = 'none';
        });
        const magicButton = document.getElementById("magicButton");
        magicButton.disabled = false;
        resetFormAndEventListeners();
    }

    const clearAllButton = document.getElementById("clearAllButton");
    clearAllButton.addEventListener("click", clearAll);

    document.addEventListener("DOMContentLoaded", function() {
        const form = document.getElementById("imageGenerationForm");
        if (form) {
            form.addEventListener("submit", handleSubmit);
        }

        document.getElementById('aiDesignButton').addEventListener('click', function() {
            const baseValues = getSelectedValues(); // Get current form values
            const mixedValues = mixAttributes(baseValues);
            console.log("Mixed Values for Generation:", mixedValues);
            generateImages(null, mixedValues, false); // Assuming generateImages handles the image generation logic
        });

        document.getElementById('magicButton').addEventListener('click', function() {
            form.submit();
        });
    });

    document.getElementById('clearImg').addEventListener('click', function() {
        clearImage();
        document.getElementById('imageDisplayUrl').value = '';
    });

    function clearImage() {
        const thumbnail = document.getElementById('thumbnail');
        thumbnail.src = '';
        const thumbContainer = document.querySelector('.thumbImg');
        thumbContainer.style.display = 'none';
    }

    function displayThumbnail(imageSrc) {
        const thumbnail = document.getElementById('thumbnail');
        const thumbDiv = document.querySelector('.thumbImg');
        thumbnail.src = imageSrc;
        thumbDiv.style.display = 'block';
    }

    function clearThumbnail() {
        const thumbnail = document.getElementById('thumbnail');
        const thumbDiv = document.querySelector('.thumbImg');
        thumbnail.src = '';
        thumbDiv.style.display = 'none';
    }

    document.getElementById('imageDisplayUrl').addEventListener('change', handleImageUpload);

    document.getElementById('avatar').addEventListener('click', function() {
        document.getElementById('avatarLightbox').style.display = 'block';
    });

    document.querySelector('.closeAvatar').addEventListener('click', function() {
        document.getElementById('avatarLightbox').style.display = 'none';
    });

    document.querySelectorAll('.avatar-option input[type="radio"]').forEach(function(radio) {
        radio.addEventListener('change', function() {
            if (this.checked) {
                document.getElementById('avatar').src = this.nextElementSibling.src;
                document.getElementById('avatarLightbox').style.display = 'none';
            }
        });
    });

    const hiddenInputs = document.querySelectorAll('input[type="hidden"]');

    function areAllOptionsEmpty() {
        for (const input of hiddenInputs) {
            if (input.value !== "") {
                return false;
            }
        }
        return true;
    }

    function handleInputChange() {
        const allOptionsEmpty = areAllOptionsEmpty();
        magicButton.disabled = allOptionsEmpty;
    }

    for (const input of hiddenInputs) {
        input.addEventListener("change", handleInputChange);
    }

    handleInputChange();

    document.querySelectorAll('.custom-dropdown .option').forEach(option => {
        option.addEventListener('click', function() {
            const dropdown = this.closest('.custom-dropdown');
            const selectedText = dropdown.querySelector('.selected-text');
            const hiddenInput = dropdown.querySelector('input[type="hidden"]');
            
            selectedText.textContent = this.textContent;
            hiddenInput.value = this.getAttribute('value');
            hiddenInput.dispatchEvent(new Event('change'));
        });
    });

    document.querySelectorAll('.custom-dropdown .clear-selection').forEach(button => {
        button.addEventListener('click', function() {
            const dropdown = this.closest('.custom-dropdown');
            const selectedText = dropdown.querySelector('.selected-text');
            const hiddenInput = dropdown.querySelector('input[type="hidden"]');
            
            selectedText.textContent = dropdown.getAttribute('data-placeholder');
            hiddenInput.value = '';
            hiddenInput.dispatchEvent(new Event('change'));
        });
    });

    window.addEventListener('load', function() {
        setTimeout(function() {
            const splash = document.getElementById('splash');
            const content = document.getElementById('content');

            splash.style.transition = 'top 0.5s ease-in-out';
            splash.style.top = '-100%';

            setTimeout(function() {
                splash.style.display = 'none';
            }, 500);
        }, 4000);
    });
});
