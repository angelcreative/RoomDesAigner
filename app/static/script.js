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

    
       function getHarmonyColors(color, type) {
        const baseColor = chroma(color);
        const baseHue = baseColor.get('hsl.h');
        let colors;

        switch (type) {
            case 'complementary':
                colors = [baseColor.hex(), chroma.hsl((baseHue + 180) % 360, baseColor.get('hsl.s'), baseColor.get('hsl.l')).hex(), "#131b24", "#131b24"];
                break;
            case 'analogous':
                colors = [baseColor.hex(), chroma.hsl((baseHue + 30) % 360, baseColor.get('hsl.s'), baseColor.get('hsl.l')).hex(), chroma.hsl((baseHue - 30 + 360) % 360, baseColor.get('hsl.s'), baseColor.get('hsl.l')).hex(), "#131b24"];
                break;
            case 'triadic':
                colors = [baseColor.hex(), chroma.hsl((baseHue + 120) % 360, baseColor.get('hsl.s'), baseColor.get('hsl.l')).hex(), chroma.hsl((baseHue + 240) % 360, baseColor.get('hsl.s'), baseColor.get('hsl.l')).hex(), "#131b24"];
                break;
            case 'square':
                colors = [baseColor.hex(), chroma.hsl((baseHue + 90) % 360, baseColor.get('hsl.s'), baseColor.get('hsl.l')).hex(), chroma.hsl((baseHue + 180) % 360, baseColor.get('hsl.s'), baseColor.get('hsl.l')).hex(), chroma.hsl((baseHue + 270) % 360, baseColor.get('hsl.s'), baseColor.get('hsl.l')).hex()];
                break;
            default:
                colors = [baseColor.hex(), "#131b24", "#131b24", "#131b24"];
        }

        return colors;
    }

    function displayColors(colors) {
        const harmonyColors = document.getElementById('harmonyColors');
        harmonyColors.innerHTML = '';

        const colorIds = ['primary_color', 'secondary_color', 'tertiary_color', 'quaternary_color'];
        colors.forEach((color, index) => {
            const colorDiv = document.createElement('div');
            colorDiv.id = colorIds[index];
            colorDiv.style.backgroundColor = color;
            harmonyColors.appendChild(colorDiv); 
        });
    }

    function updateHarmonyColors(color) {
        const harmonyType = document.getElementById('harmonyType').value;
        const colors = getHarmonyColors(color, harmonyType);
        displayColors(colors);
    }

    function initializeColorWheel() {
        var colorWheelContainer = document.getElementById('colorWheelContainer');
        var colorWheel = new iro.ColorPicker(colorWheelContainer, {
            width: 200,
            color: "#46696d"
        });

        colorWheel.on(['color:init', 'color:change'], function(color) {
            updateHarmonyColors(color.hexString
);
});
        
            document.getElementById('harmonyType').addEventListener('change', function() {
        updateHarmonyColors(colorWheel.color.hexString);
    });

    // Initial call to set the harmony colors based on the default color of the color wheel
    updateHarmonyColors(colorWheel.color.hexString);
}

// Call the function to initialize the color wheel
initializeColorWheel();
    
    
// Asegúrate de que las funciones showOverlay, getSelectedValues y generateImages estén definidas correctamente.

 
    
    
    function getSelectedValues() {
        const elementIds = [
            "point_of_view",
            "harmonyType",
            "primary_color",
            "secondary_color",
            "tertiary_color",
            "quaternary_color",
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
            "furniture_color",
          "furniture_pattern",
          "seating_upholstery_pattern",
            "designed_by_this_interior_designer",
            "designed_by_this_architect",
          "lens_used",
            "filmgrain_used_to_take_the_shot",
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
            "walls_paint_color",
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
            "picture",
            "design_style",
            "decorative_elements",
           "person"
        ];

        const values = {};

        elementIds.forEach(elementId => {
    const element = document.getElementById(elementId);
    if (element) {
      values[elementId] = element.value;
    }
  });
        
        // Slider event listener for displaying value
  const slider = document.getElementById("strengthSlider");
  const sliderValueDisplay = document.getElementById("sliderValue");

  slider.addEventListener("input", function() {
    sliderValueDisplay.textContent = this.value;
  });

  const imageDisplay = document.getElementById("imageDisplay");
  if (imageDisplay && imageDisplay.src) {
    values["imageUrl"] = imageDisplay.src; // Añade la URL de la imagen si está presente
  }

  return values;
}
  
    const selectedValues = getSelectedValues();
    console.log(selectedValues);

   
    // Function to generate the optional text
    function generateOptionalText() {
      return "(((Rounded organic shapes, rounded shapes, organic shapes)))";
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
    
    document.getElementById('closeDialogButton').addEventListener('click', function() {
        document.getElementById('generatingImagesDialog').style.display = 'none';
    });
    
    function showErrorInDialog() {
        document.getElementById('dialogTitle').textContent = 'Something wrong happen when building the designs, close this window and try it again 🙏🏽';
//        document.getElementById('closeDialogButton').style.display = 'block'; // Mostrar el botón de cierre
    }


 
function generateImages(imageUrl, selectedValues, isImg2Img) {
  showGeneratingImagesDialog();

  const apiKey = "X0qYOcbNktuRv1ri0A8VK1WagXs9vNjpEBLfO8SnRRQhN0iWym8pOrH1dOMw"; // Reemplaza con tu clave API real
  const customText = document.getElementById("customText").value;
  const pictureSelect = document.getElementById("imageDisplayUrl");
  const selectedPicture = pictureSelect.value;
    const promptInit = `High-end editorial photography, Resolution Ultra HD 8K for impeccable detail,  Rendering Technique Octane Render for photorealistic textures and lighting,  `;

  let plainText = Object.entries(selectedValues)
    .filter(([key, value]) => value && key !== "imageUrl")
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");

  const promptEndy = ` (abundant furniture, multiple decorations, numerous decor items, densely furnished, fully equipped, richly appointed)`;
  
  const aspectRatio = document.querySelector('input[name="aspectRatio"]:checked').value;
  const width = aspectRatio === "portrait" ? 1024 : 1024;
  const height = aspectRatio === "portrait" ? 1024 : 512;

  const seedSwitch = document.getElementById("seedSwitch");
  const seedEnabled = seedSwitch.checked;
  const seedValue = seedEnabled ? null : "19071975";

  const optionalText = document.getElementById("optionalTextCheckbox").checked ? generateOptionalText() : "";
  const promptText = `${promptInit} ${plainText} ${customText} ${promptEndy} ${optionalText}`;

  const prompt = {
    key: apiKey,
    prompt: JSON.stringify(promptText),
    negative_prompt: "ugly face, split image, out of frame, lowres, text, error, cropped, worst quality, low quality, jpeg artifacts, duplicate,  bad proportions,  bad anatomy, extra limbs, poorly drawn face, poorly drawn hands, missing fingers, diformed hands, signature, blurry, art, anime, tiling, out of frame, disfigured, deformed, watermark",
    width: width, 
    height: height,

    //width: "1024",
    //height: "1024",
    samples: "4",
    guidance_scale: "5",
    //num_inference_steps: "50",
    //scheduler: "KarrasVeScheduler",
    //self_attention: "no", //testing no
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
    
      const chipsSV = document.getElementById("chipsSV");
        chipsSV.innerHTML = ""; // Clear the existing content

        for (const [key, value] of Object.entries(selectedValues)) {
          if (value) {
            // Replace "_" with " " in the value
            const formattedValue = value.replace(/_/g, " ");
            
            const chip = document.createElement("span");
            chip.classList.add("chipSV");

            // Check if the value is a valid hex color
            const isHexColor = /^#[0-9A-Fa-f]{6}$/i.test(formattedValue);
            if (isHexColor) {
              chip.classList.add("hexDot"); // Add the "hexDot" class
              chip.style.backgroundColor = formattedValue;
            } else {
              chip.textContent = formattedValue;
            }

            if (formattedValue.includes("_")) {
              chip.style.visibility = "visible"; // Hide "_" character
            }

            chipsSV.appendChild(chip);
          }
        }


      // Get the <span> element by its class name
      var spanElement = document.querySelector(".chipSV");

      // Get the text content of the <span> element
      var text = spanElement.textContent;

      // Replace all underscore characters with non-breaking spaces
      var modifiedText = text.replace(/_/g, "&nbsp;");

      // Update the text content of the <span> element
      spanElement.textContent = modifiedText;
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
    
    

// Define the checkImageStatus function
function checkImageStatus(fetchResultUrl) {
    fetch(fetchResultUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Include any other necessary headers, such as authorization headers if needed
        }
        // If additional data needs to be sent in the request body, include it here
        // body: JSON.stringify({ /* Your data here */ })
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
}

    
      

    
// Asegúrate de que las funciones adicionales como showGeneratingImagesDialog, hideOverlay, etc., estén definidas y funcionen correctamente.

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

    // Function to show the overlay
    function showOverlay() {
      const overlay = document.getElementById("overlay");
      overlay.style.display = "block";
    }
    
    
   


    
    
    
    
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
 

    // The new endpoint expects an image URL directly, so we skip the Base64 conversion
    // and use the imageUrl as is.

    const url = 'https://ai-picture-upscaler.p.rapidapi.com/upscaler/v2/';
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': '076e563ff0msh5fffe0c2d818c0dp1b32e3jsn62452f3f696d',
        'X-RapidAPI-Host': 'ai-picture-upscaler.p.rapidapi.com'
      },
      body: new URLSearchParams({
        image_url: imageUrl, // Directly pass the image URL
        scale: '2' // The desired scale
      })
    };

    // Send the request to the upscaling API
    const response = await fetch(url, options);
    const result = await response.text(); // Assuming the response is text
    const data = JSON.parse(result); // Parse the response to JSON

    // Check the console to see the full API response
    console.log(data);

    // Use the correct property from the API response to get the upscaled image URL
    const upscaledImageUrl = data.result_url;

    // Open a new window or tab and display the upscaled image
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
      <html>
        <head>
          <title>Upscaled Image</title>
           <style>body {
    text-align: center;
    color: #a9fff5;
    font-family: arial, sans-serif;
    font-size: 12px;
    padding-top: 60px;
    background: url('http://127.0.0.1:5000/static/img/logo_web_light.svg') no-repeat center top #1f1f1f;
    background-size: 150px;
    margin-top: 40px;
}

h1 {
    margin: 20px 0
}



img {
    border-radius: 12px;
    overflow: hidden;
max-width:80%;
}

html {
    background: #1f1f1f;
}</style>
        </head>
        <body>
          <h1>Upscaled Image</h1>
          <p>Use KreaAi or Magnific to enhance details</p>
          <img src="${upscaledImageUrl}" alt="Upscaled Image" style="max-width:80%; border-radius:12px; overflow:hidden;">
        </body>
      </html>
    `);
    newWindow.document.close();

   
  } catch (error) {
    console.error(error);
   
  }
};



    



    
    // Function to copy image URL to clipboard
    function copyImageUrlToClipboard(imageUrl) {
      const tempInput = document.createElement("textarea");
      tempInput.value = imageUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      
      generateMessageDiv("Image URL copied to clipboard!");
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

    
    
    function showModal(imageUrls, promptText) {
    const modal = document.getElementById("modal");
    const closeButton = modal.querySelector(".close");

    // Ensure only one event listener is added
    closeButton.removeEventListener("click", closeModalHandler);
    closeButton.addEventListener("click", closeModalHandler);

    // Get the thumbnail image source (user-uploaded image)
    const thumbnailImage = document.getElementById("thumbnail");
    const userImageBase64 = thumbnailImage.src;

    const imageGrid = document.getElementById("imageGrid");
    imageGrid.innerHTML = ""; // Clear previous images

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

        // Create and append buttons (Copy URL, Copy Prompt, Upscale)
        // Create "Edit in Photopea" button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit in Photopea";
        editButton.addEventListener("click", () => {
            openPhotopeaWithImage(imageUrl);
        });
         // Create download button
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download";
    downloadButton.addEventListener("click", () => downloadImage(imageUrl));

        const copyButton = createButton("Copy URL", () => copyImageUrlToClipboard(imageUrl));
        const copyPromptButton = createButton("Copy Prompt", () => copyTextToClipboard(promptText));
        const upscaleButton = createButton("Upscale", () => upscaleImage(imageUrl));
        buttonsContainer.appendChild(downloadButton);
        buttonsContainer.appendChild(copyButton);
        buttonsContainer.appendChild(editButton);
        buttonsContainer.appendChild(copyPromptButton);
        buttonsContainer.appendChild(upscaleButton);

        // Create "Compare" button
        const compareButton = createButton("Compare", () => openComparisonWindow(userImageBase64, imageUrl));
        buttonsContainer.appendChild(compareButton);

        // Append image and buttons to image container
        imageContainer.appendChild(image);
        imageContainer.appendChild(buttonsContainer);

        // Append image container to image grid
        imageGrid.appendChild(imageContainer);
    });

    // Show the modal
    modal.style.display = "block";
    showOverlay();
}


    
    
function createButton(text, onClickHandler) {
    const button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", onClickHandler);
    return button;
}

function openComparisonWindow(userImageBase64, generatedImageUrl) {
    // Send the base64 image data to the server
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
            // Open the new window with the unique URL
            const url = `https://roomdesaigner.onrender.com/compare/${data.slug}`;
            window.open(url, '_blank');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function closeModalHandler() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
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
    selectElements.forEach(function(selectElement) {
      selectElement.addEventListener('change', function() {
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
//    resetFormAndEventListeners();
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
      selectElements.forEach(function(selectElement) {
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


document.addEventListener("DOMContentLoaded", function() {
  const fileInput = document.getElementById("imageDisplayUrl");
  const thumbnailContainer = document.querySelector(".thumbImg");
  const thumbnailImage = document.getElementById("thumbnail");

  fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        thumbnailImage.src = e.target.result;
        thumbnailContainer.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });
});

//disable MB

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



window.addEventListener('load', function() {
  setTimeout(function() {
    var splash = document.getElementById('splash');
    var content = document.getElementById('content');

    splash.style.transition = 'top 0.5s ease-in-out'; // Add transition effect
    splash.style.top = '-100%'; // Move the splash screen to the top

    setTimeout(function() {
      splash.style.display = 'none'; // Hide the splash screen
//      content.style.display = 'block'; // Show the website content
    }, 500); // Wait for the transition to complete (0.5 seconds)
  }, 4000); // 4 seconds (4000 milliseconds)
});

document.getElementById('clearImg').addEventListener('click', function() {
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

document.getElementById('imageInput').addEventListener('change', handleImageUpload);




// Event listener for opening the lightbox when the avatar is clicked
document.getElementById('avatar').addEventListener('click', function() {
    document.getElementById('avatarLightbox').style.display = 'block';
});

// Event listener for closing the lightbox
document.querySelector('.closeAvatar').addEventListener('click', function() {
    document.getElementById('avatarLightbox').style.display = 'none';
});

// Event listener for changing the avatar when a new one is selected
document.querySelectorAll('.avatar-option input[type="radio"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
        if (this.checked) {
            // Update the src of the main avatar image
            document.getElementById('avatar').src = this.nextElementSibling.src;

            // Optionally, close the lightbox after selection
            document.getElementById('avatarLightbox').style.display = 'none';
        }
    });
});
