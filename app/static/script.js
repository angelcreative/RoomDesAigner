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
      switchElement.addEventListener('change', function() {
          const colorPickers = this.closest('.colorPickersGroup').querySelectorAll('.colorPicker');
          colorPickers.forEach(picker => {
              picker.disabled = !this.checked;
          });
      });
  });

  // Ensure color pickers are enabled/disabled on page load based on switch state
  document.addEventListener('DOMContentLoaded', function() {
      document.querySelectorAll('.switchContainer input[type="checkbox"]').forEach(switchElement => {
          const colorPickers = switchElement.closest('.colorPickersGroup').querySelectorAll('.colorPicker');
          colorPickers.forEach(picker => {
              picker.disabled = !switchElement.checked;
          });
      });
  });

  // Function to generate the optional text
  function generateOptionalText() {
    return "(((Rounded organic shapes, rounded shapes, organic shapes)))";
  }

  // Slider event listener for displaying value
  const slider = document.getElementById("strengthSlider");
  const sliderValueDisplay = document.getElementById("sliderValue");

  slider.addEventListener("input", function() {
    sliderValueDisplay.textContent = this.value;
  });

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

  document.getElementById('closeDialogButton').addEventListener('click', function() {
      document.getElementById('generatingImagesDialog').style.display = 'none';
  });

  async function checkImageAvailability(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async function waitForImages(urls, maxRetries = 100, delay = 2000) {
    for (let i = 0; i < maxRetries; i++) {
      const results = await Promise.all(urls.map(checkImageAvailability));
      if (results.every(available => available)) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    return false;
  }

 
function generateImages(imageUrl, selectedValues, isImg2Img) {
    showGeneratingImagesDialog();

    const apiKey = "X0qYOcbNktuRv1ri0A8VK1WagXs9vNjpEBLfO8SnRRQhN0iWym8pOrH1dOMw"; // Reemplaza con tu clave API real
    const customText = document.getElementById("customText").value;
    const pictureSelect = document.getElementById("imageDisplayUrl");
    const selectedPicture = pictureSelect.value;
    const promptInit = `Create an exceptionally detailed and professional photoshoot masterpiece. The photograph must be ultra-high-definition (UHD) and captured in 16k resolution, using RAW format to ensure the highest quality. Emphasize ultra-realism with lifelike, photo-realistic details, soft shadows, and impeccable sharpness. Prioritize ultra-detail, precision, and clarity to achieve a visually stunning, highly appealing result. Focus on achieving the best quality, with every element meticulously rendered for an extraordinary, realistic appearance.`;

    let plainText = Object.entries(selectedValues)
        .filter(([key, value]) => value && key !== "imageUrl")
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");

    const promptEndy = `[multiple decorations: numerous decor items:1], [densely furnished: fully equipped:1], [stylishly streamlined: pattern details:1],`;

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

    const prompt = {
        key: apiKey,
        prompt: promptText,
        negative_prompt: " (deformed iris), (deformed pupils), semi-realistic, (anime:1), text, close up, cropped, out of frame, worst quality, (((low quality))), jpeg artifacts, (ugly:1), duplicate, morbid, mutilated, ((extra fingers:1)), mutated hands, ((poorly drawn hands:1)), poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, ((extra limbs:1)), cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, (((fused fingers:1))), (too many fingers:1), long neck ",
        width: width,
        height: height,
        samples: "4",
        guidance_scale: "10",
        num_inference_steps: "40",
        seed: seedValue,
        webhook: null,
        safety_checker: false,
        base64: false,
        track_id: null,
    };

    if (isImg2Img && imageUrl) {
        prompt.init_image = imageUrl;

        const strengthSlider = document.getElementById("strengthSlider");
        prompt.strength = parseFloat(strengthSlider.value);
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
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(async data => {
        if (data.status === "success" && data.proxy_links) {
            const imageUrls = data.proxy_links.map(url =>
                url.replace("https://d1okzptojspljx.cloudfront.net", "https://modelslab.com")
            );

            const imagesReady = await waitForImages(imageUrls);
            if (imagesReady) {
                showModal(imageUrls, data.transformed_prompt);
            } else {
                showError({ message: "Images are not ready yet. Please try again later." });
            }

            hideGeneratingImagesDialog();
        } else {
            showError(data);
        }
    })
    .catch(error => {
        showError(error);
    });
}

function showError(error) {
    console.error("Error:", error.message || error);
    const processingMessageContainer = document.getElementById("processingMessageContainer");
    if (processingMessageContainer) {
        processingMessageContainer.innerHTML = '<p>😢 Something went wrong, try again in a moment.</p><i class="fa fa-plus-circle" id="dismissErrorButton" aria-hidden="true"></i>';
        processingMessageContainer.style.display = 'block';
    }
    hideOverlay(); // Asegúrate de que esta función existe y oculta la interfaz de carga

    // Add event listener for the dismiss button
    const dismissButton = document.getElementById("dismissErrorButton");
    if (dismissButton) {
        dismissButton.addEventListener('click', hideErrorMessage);
    }
}

// Function to hide the error message
function hideErrorMessage() {
    const processingMessageContainer = document.getElementById("processingMessageContainer");
    if (processingMessageContainer) {
        processingMessageContainer.style.display = 'none';
    }
}

async function checkImageAvailability(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function waitForImages(urls, maxRetries = 10, delay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    const results = await Promise.all(urls.map(checkImageAvailability));
    if (results.every(available => available)) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  return false;
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

  // ENHANCE IMAGE
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
          const data = await response.json();  // Parse the response to JSON

          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }

          // Parsing the nested JSON string inside the 'body' property
          if (data.output && data.output.body) {
              const body = JSON.parse(data.output.body);
              const upscaledImageUrl = body.output_image_url;

              if (upscaledImageUrl) {
                  const newWindow = window.open('', '_blank');
                  newWindow.document.write(`
                      <html>
                          <head>
                              <title>Upscaled Image</title>
                              <link rel="icon" type="image/png" sizes="192x192" href="https://roomdesaigner.onrender.com/static/img/android-icon-192x192.png">
                              <link rel="icon" type="image/png" sizes="32x32" href="https://roomdesaigner.onrender.com/static/img/favicon-32x32.png">
                              <link rel="icon" type="image/png" sizes="96x96" href="https://roomdesaigner.onrender.com/static/img/favicon-96x96.png">
                              <link rel="icon" type="image/png" sizes="16x16" href="https://roomdesaigner.onrender.com/static/img/favicon-16x16.png">
                              <style>
                                  html {
                                      background: #15202b;
                                  }
                                      
                                  body {
                                      text-align: center;
                                      color: #a9fff5;
                                      font-family: arial, sans-serif;
                                      font-size: 12px;
                                      padding-top: 60px;
                                      margin-top: 40px;
                                  }
                                   
                                  h1 {
                                      margin: 20px 0;
                                  }
                                      
                                  img {
                                      border-radius: 12px;
                                      overflow: hidden;
                                      max-width: 100%;
                                  }
                                  
                                  img.logoRD {
                                      margin: 20px auto 0 auto;
                                      display: block;
                                      height: 50px;
                                  }
                                      
                              </style>
                          </head>
                          <body>
                          <img class="logoRD" src="https://roomdesaigner.onrender.com/static/img/logo_web_light.svg">
                              <h1>Upscaled Image</h1>
                              <img src="${upscaledImageUrl}" alt="Upscaled Image" style="max-width:80%; border-radius:12px; overflow:hidden;">
                          </body>
                      </html>
                  `);
                  newWindow.document.close();
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
  };

  // Function to search an image on RapidAPI and display results in a new tab
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

  // Function to display search results in a new tab
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

  // compare
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


    // Helper function to create a button and attach an event listener
function createButton(text, onClickHandler) {
    const button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", onClickHandler);
    return button;
}
    
  // Displays modal with generated images and associated action buttons
  function showModal(imageUrls, transformedPrompt) {
      const modal = document.getElementById("modal");
      const closeButton = modal.querySelector(".close");

      closeButton.removeEventListener("click", closeModalHandler);
      closeButton.addEventListener("click", closeModalHandler);

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
          const copyPromptButton = createButton("Copy Prompt", () => copyTextToClipboard(transformedPrompt));
          const upscaleButton = createButton("Upscale", () => upscaleImage(imageUrl));
          const compareButton = createButton("Compare", () => openComparisonWindow(imageUrl));

          [downloadButton, copyButton, editButton, copyPromptButton, upscaleButton, compareButton].forEach(button => buttonsContainer.appendChild(button));

          imageContainer.appendChild(image);
          imageContainer.appendChild(buttonsContainer);
          imageGrid.appendChild(imageContainer);
      });

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
    window.open(imageUrl, "_blank");
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
  }

  // Function to clear all form values and reset the image display
  function clearAll(event) {
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

// Event listener for file input change
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

// Function to check if all select options have empty values
function areAllOptionsEmpty() {
  const selectElements = document.querySelectorAll("select");
  for (const select of selectElements) {
    if (select.value !== "") {
      return false; // At least one option has a non-empty value
    }
  }
  return true; // All options have empty values
}

// Function to handle changes in select elements
function handleSelectChange() {
  const magicButton = document.getElementById("magicButton");
  const allOptionsEmpty = areAllOptionsEmpty();
  magicButton.disabled = allOptionsEmpty; // Disable magicButton if all options have empty values
}

// Listen for changes in select elements
document.addEventListener("DOMContentLoaded", function() {
  const selectElements = document.querySelectorAll("select");
  for (const select of selectElements) {
    select.addEventListener("change", handleSelectChange);
  }
  // Initial check on page load
  handleSelectChange();
});

window.addEventListener('load', function() {
  setTimeout(function() {
    var splash = document.getElementById('splash');
    splash.style.transition = 'top 0.5s ease-in-out'; // Add transition effect
    splash.style.top = '-100%'; // Move the splash screen to the top

    setTimeout(function() {
      splash.style.display = 'none'; // Hide the splash screen
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
