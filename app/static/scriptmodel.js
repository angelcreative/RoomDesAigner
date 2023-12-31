


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
//document.getElementById('password-form').addEventListener('submit', function(event) {
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

// Asegúrate de que las funciones showOverlay, getSelectedValues y generateImages estén definidas correctamente.

 
    
    
    function getSelectedValues() {
        const elementIds = [
            "point_of_view",
            "primary_color",
            "secondary_color",
            "tertiary_color",
            "color_scheme",
            "room_size",
            "home_room",
            "space_to_be_designed",
            "children_room",
            "pool",
            "garden",
            "room_shape",
            "inspired_by_this_interior_design_magazine",
            "furniture_provided_by_this_vendor",
            "furniture_color",
            "designed_by_this_interior_designer",
            "designed_by_this_architect",
            "film_used_to_take_the_shot",
            "illumination",
            "door",
            "windows",
            "ceiling_design",
            "roof_material",
            "roof_height",
            "wall_type",
            "wall_cladding",
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
            "decorative_elements"
        ];

        const values = {};

        elementIds.forEach(elementId => {
    const element = document.getElementById(elementId);
    if (element) {
      values[elementId] = element.value;
    }
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
  const pictureSelect = document.getElementById("picture");
  const selectedPicture = pictureSelect.value;
  const promptInit = `${selectedPicture}, interiordesign, homedecor, architecture, homedesign, UHD`;

  let plainText = Object.entries(selectedValues)
    .filter(([key, value]) => value && key !== "imageUrl")
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");

  const promptEndy = `interiordesign, homedecor, architecture, homedesign, UHD, ${selectedPicture}, `;
  const aspectRatio = document.querySelector('input[name="aspectRatio"]:checked').value;
  const width = aspectRatio === "portrait" ? 512 : 1024;
  const height = aspectRatio === "portrait" ? 1024 : 512;

  const seedSwitch = document.getElementById("seedSwitch");
  const seedEnabled = seedSwitch.checked;
  const seedValue = seedEnabled ? null : "19071975";

  const optionalText = document.getElementById("optionalTextCheckbox").checked ? generateOptionalText() : "";
  const promptText = `${promptInit} ${plainText} ${customText} ${promptEndy} ${optionalText}`;

 const prompt = {
    key: apiKey,
    model_id: "sdxl",
    prompt: JSON.stringify(promptText),
    negative_prompt: "split image, out of frame, lowres, text, error, cropped, worst quality, low quality, jpeg artifacts, duplicate, out of frame, blurry, bad proportions, gross proportions, username, watermark, signature, blurry, bad proportions, art, anime, tiling, out of frame, disfigured, deformed, watermark",
    width: width,
    height: height,
    samples: "4",
    num_inference_steps: "20",
    seed: seedValue,
    guidance_scale: 7.25,
    webhook: null,
    track_id: null,
    safety_checker: null,
    enhance_prompt: null,
    multi_lingual: null,
    panorama: null,
    self_attention: null,
    upscale: null,
    embeddings_model: null,
    scheduler: "UniPCMultistepScheduler",
  };
    

  if (isImg2Img && imageUrl) {
    prompt.init_image = imageUrl;
    prompt.strength = 0.7; // Valor de intensidad para img2img
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
    processingMessageContainer.innerHTML = '<p>😢 Something went wrong, try again in a moment.</p><button id="dismissErrorButton" style="cursor:pointer;">X</button>';
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
      const rerollButton = document.getElementById("rerollButton");
      //rerollButton.disabled = true;
      const selectedValues = getSelectedValues();
      generateImages(null, selectedValues);
    }

    // Add event listener to the rerollButton
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
    
//   upscale
    
    function getBase64Image(image) {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0);
      const dataURL = canvas.toDataURL("image/jpeg");
      return dataURL.replace(/^data:image\/(png|jpeg);base64,/, "");
    }

 

    
    function showModalWithProgressBar() {
      // Create modal element
      const modalUpscale = document.createElement("div");
      modalUpscale.id = "modalUpscale";

      // Create container element
      const containerUpscale = document.createElement("div");
      containerUpscale.classList.add("containerUpscale");

      // Create <img> element
      const imgElement = document.createElement("img");
      imgElement.src = "static/img/modal_img/scaling.svg";
      imgElement.setAttribute("alt", "Image");
      imgElement.classList.add("imgLoader");

      // Create message element
      const message = document.createElement("h1");
      message.textContent = "Upscaling your image, it could take a moment...";

      // Create microcopy element
      const microcopy = document.createElement("p");
      microcopy.textContent = "The image will be automatically downloaded";

      // Create progress bar element
      const progressBar = document.createElement("div");
      progressBar.classList.add("progress-bar");

      // Append elements to container
      containerUpscale.appendChild(imgElement);
      containerUpscale.appendChild(message);
      containerUpscale.appendChild(microcopy);

      // Append container and progress bar to modal
      modalUpscale.appendChild(containerUpscale);
      modalUpscale.appendChild(progressBar);

      // Append modal to the document body
      document.body.appendChild(modalUpscale);
    }

    function hideModal() {
      // Remove the modal from the document body
      const modalUpscale = document.getElementById("modalUpscale");
      if (modalUpscale) {
        document.body.removeChild(modalUpscale);
      }
    }

    const upscaleImage = async (imageUrl) => {
      try {
        showModalWithProgressBar();

        // Load the image
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = '/proxy-image?url=' + encodeURIComponent(imageUrl);

        image.onload = async () => {
          // Convert image to Base64
          const base64Image = getBase64Image(image);

          const url = 'https://super-image1.p.rapidapi.com/run';
          const options = {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'X-RapidAPI-Key': '5288a49c47mshc0d528176d70522p1a13b5jsn7205ba3bf330',
              'X-RapidAPI-Host': 'super-image1.p.rapidapi.com'
            },
            body: JSON.stringify({
              upscale: 2,
              image: base64Image
            })
          };

          const response = await fetch(url, options);
          const data = await response.json();
          console.log(data);

          // Open the upscaled image in a new browser tab
          const newTab = window.open(data.output_url, '_blank');
          newTab.focus();

          hideModal();
        };
      } catch (error) {
        console.error(error);
        // Handle error here
        hideModal();
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
    // Function to display the generated images in a modal
    function showModal(imageUrls, promptText) {
        const modal = document.getElementById("modal");
        const closeButton = modal.querySelector(".close");

        // Asegurarse de que solo se añade un event listener
        closeButton.removeEventListener("click", closeModalHandler);
        closeButton.addEventListener("click", closeModalHandler);
        
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

        // Attach click event listener to open image in new tab
        image.addEventListener("click", () => {
          openImageInNewTab(imageUrl);
        });

        // Create buttons container
        const buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("image-buttons");

        // Create copy URL button
        const copyButton = document.createElement("button");
        copyButton.textContent = "Copy URL";
        copyButton.addEventListener("click", () => {
          copyImageUrlToClipboard(imageUrl);
        });

        // Create copy prompt button
        const copyPromptButton = document.createElement("button");
        copyPromptButton.textContent = "Copy Prompt";
        copyPromptButton.addEventListener("click", () => {
          copyTextToClipboard(promptText);
        });

        
          // Create upscale button
          const upscaleButton = document.createElement("button");
          upscaleButton.textContent = "Upscale";
          upscaleButton.addEventListener("click", () => {
            upscaleImage(imageUrl);
          });
          
          

        // Append buttons to buttons container
        buttonsContainer.appendChild(copyButton);
        buttonsContainer.appendChild(copyPromptButton);
        buttonsContainer.appendChild(upscaleButton);

        // Append image and buttons container to image container
        imageContainer.appendChild(image);
        imageContainer.appendChild(buttonsContainer);

        // Append image container to image grid
        imageGrid.appendChild(imageContainer);
      });

      // Show the modal
      modal.style.display = "block";
      showOverlay(); // Show the overlay
        
        function closeModalHandler() {
               modal.style.display = "none";
           }
    }
    
  // Function to open the image in a new tab
  function openImageInNewTab(imageUrl) {
    window.open(imageUrl, "_blank");
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

// 1mb img and resize

function handleImageUpload(event) {
    const imageFile = event.target.files[0];

    // Check file size
    if (imageFile.size > 1048576) { // 1MB = 1048576 bytes
        alert("File is larger than 1MB. Please upload a smaller file.");
        event.target.value = ''; // Reset the file input
        clearThumbnail(); // Clear the thumbnail if it's already displayed
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // Check image width and resize if necessary
            if (this.width > 800) {
                resizeAndDisplayImage(this, imageFile.name);
            } else {
                displayThumbnail(this.src); // Display the original image as thumbnail
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
}

function resizeAndDisplayImage(image, imageName) {
    const canvas = document.createElement('canvas');
    const scaleFactor = 800 / image.width;
    canvas.width = 800;
    canvas.height = image.height * scaleFactor;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(function(blob) {
        // Create a new file object from the resized blob
        const newFile = new File([blob], imageName, {
            type: 'image/jpeg',
            lastModified: Date.now()
        });

        // Display the resized image as a thumbnail
        displayThumbnail(URL.createObjectURL(newFile));
    }, 'image/jpeg');
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
