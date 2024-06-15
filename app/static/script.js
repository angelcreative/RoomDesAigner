document.addEventListener("DOMContentLoaded", function() {
  // PRESETS
  const savePresetButton = document.getElementById("savePresetButton");
  const modalPreset = document.getElementById("modalPreset");
  const closePresetSpan = document.getElementsByClassName("closePreset")[0];
  const savePreset = document.getElementById("savePreset");
  const myPresetsButton = document.getElementById("myPresetsButton");
  const drawerPreset = document.getElementById("drawerPreset");
  const closeDrawerPresetSpan = document.getElementsByClassName("closeDrawerPreset")[0];
  const presetsList = document.getElementById("presetsList");
  const magicButton = document.getElementById("magicButton");
  const aiDesignButton = document.getElementById("aiDesignButton");

  savePresetButton.addEventListener("click", function() {
    modalPreset.style.display = "block";
  });

  closePresetSpan.onclick = function() {
    modalPreset.style.display = "none";
  };

  window.onclick = function(event) {
    if (event.target == modalPreset) {
      modalPreset.style.display = "none";
    }
    if (event.target == drawerPreset) {
      drawerPreset.style.display = "none";
    }
  };

  savePreset.addEventListener("click", function() {
    const presetName = document.getElementById("presetName").value;
    if (presetName) {
      const selectedValues = getSelectedValues();
      const customText = document.getElementById("customText").value;

      const preset = {
        name: presetName,
        values: selectedValues,
        customText: customText
      };

      fetch("/save-preset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(preset)
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert("Preset saved successfully!");
          displayPresets();
          modalPreset.style.display = "none";
        } else {
          alert("Error saving preset. Please try again.");
        }
      })
      .catch(error => {
        console.error("Error saving preset:", error);
        alert("Error saving preset. Please try again.");
      });
    }
  });

  myPresetsButton.addEventListener("click", function() {
    drawerPreset.style.display = "block";
    displayPresets();
  });

  closeDrawerPresetSpan.onclick = function() {
    drawerPreset.style.display = "none";
  };

  function displayPresets() {
    fetch("/get-presets")
      .then(response => response.json())
      .then(data => {
        presetsList.innerHTML = "";
        data.presets.forEach(preset => {
          const listItem = document.createElement("li");
          listItem.textContent = `${preset.name} - ${preset.customText}`;
          
          const loadButton = document.createElement("button");
          loadButton.textContent = "Load Preset";
          loadButton.addEventListener("click", () => loadPreset(preset));

          listItem.appendChild(loadButton);
          presetsList.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error("Error fetching presets:", error);
      });
  }

  function loadPreset(preset) {
    Object.entries(preset.values).forEach(([key, value]) => {
      const element = document.getElementById(key);
      if (element) {
        element.value = value;
      }
    });
    document.getElementById("customText").value = preset.customText;
    drawerPreset.style.display = "none";
  }

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
  aiDesignButton.addEventListener('click', function() {
    const baseValues = getSelectedValues(); // Get current form values
    const mixedValues = mixAttributes(baseValues);
    console.log("Mixed Values for Generation:", mixedValues);
    generateImages(null, mixedValues, false); // Assuming generateImages handles the image generation logic
  });

  // Handle form submission for image generation
  form.addEventListener("submit", handleSubmit);

  function handleSubmit(event) {
    event.preventDefault();
    magicButton.disabled = false;
    showOverlay();

    const fileInput = document.getElementById("imageDisplayUrl");
    const file = fileInput.files[0]; // Ensure you get the first file if present
    const selectedValues = getSelectedValues();
    const isImg2Img = Boolean(file); // Determine if img2img is used based on file presence

    if (file) {
      // Process image upload to imgbb if a file is selected
      const apiKey = "ba238be3f3764905b1bba03fc7a22e28"; // Your imgbb API key
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
          // If image upload is successful, get the URL and proceed with img2img
          const imageUrl = data.data.url;
          generateImages(imageUrl, selectedValues, isImg2Img);
        } else {
          throw new Error("Image upload failed: " + data.error.message);
        }
      })
      .catch(error => {
        // Error handling for image upload failure
        handleError(error.message);
      });
    } else {
      // Process txt2img if no file is selected
      generateImages(null, selectedValues, isImg2Img);
    }
  }

  function handleError(errorMessage) {
    console.error(errorMessage);
    magicButton.disabled = false;
    hideOverlay(); // Ensure this function exists and hides the loading interface
    alert(errorMessage); // Optional: show error message in an alert
  }

  // Other necessary functions like showOverlay, hideOverlay, getSelectedValues, generateImages, etc.

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

  const selectedValues = getSelectedValues();
  console.log(selectedValues);

  // Function to generate the optional text
  function generateOptionalText() {
    return "(((Rounded organic shapes, rounded shapes, organic shapes)))";
  }

  // Function to generate fractal text
  function generateFractalText() {
    return "(((fractal, fractality pattern details)))";
  }

  function showGeneratingImagesDialog() {
    document.getElementById('generatingImagesDialog').style.display = 'block';
    document.getElementById('dialogTitle').textContent = 'Crafting Your Vision';
  }

  function hideGeneratingImagesDialog() {
    document.getElementById('generatingImagesDialog').style.display = 'none';
  }

  function showErrorInDialog() {
    document.getElementById('dialogTitle').textContent = 'Something went wrong when building the designs, close this window and try it again 🙏🏽';
  }

  function retryGeneration() {
    hideGeneratingImagesDialog();
    // Call the function that starts image generation again
    generateImages();
  }

  document.getElementById('closeDialogButton').addEventListener('click', function() {
    document.getElementById('generatingImagesDialog').style.display = 'none';
  });

  function showErrorInDialog() {
    document.getElementById('dialogTitle').textContent = 'Something went wrong when building the designs, close this window and try it again 🙏🏽';
  }

  function generateImages(imageUrl, selectedValues, isImg2Img) {
    showGeneratingImagesDialog();

    const apiKey = "X0qYOcbNktuRv1ri0A8VK1WagXs9vNjpEBLfO8SnRRQhN0iWym8pOrH1dOMw"; // Your real API key
    const customText = document.getElementById("customText").value;
    const pictureSelect = document.getElementById("imageDisplayUrl");
    const selectedPicture = pictureSelect.value;
    const promptInit = `Create a highly detailed and professional photoshoot masterpiece. The photo should be highly defined, with soft shadows, the best quality, and a realistic, photo-realistic appearance. Ensure it is in UHD and 16k resolution`;

    let plainText = Object.entries(selectedValues)
      .filter(([key, value]) => value && key !== "imageUrl")
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");

    const promptEndy = `[multiple decorations: numerous decor items:1], [densely furnished: fully equipped:1], [stylishly streamlined: pattern details:1], `;

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
      track_id: null,
    };

    if (isImg2Img && imageUrl) {
      prompt.init_image = imageUrl;

      // Get the strength value from the slider
      const strengthSlider = document.getElementById("strengthSlider");
      prompt.strength = parseFloat(strengthSlider.value); // Use the slider value instead of a fixed value
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
        // Directly throw an error with the status to handle it in the catch block
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();  // Parse JSON only if the response was OK
    })
    .then(data => {
      // Handle the API response based on its status
      if (data.status === "success" && data.output) {
        const imageUrls = data.output.map(url =>
          url.replace("https://d1okzptojspljx.cloudfront.net", "https://modelslab.com")
        );
        showModal(imageUrls, data.transformed_prompt);  // Display images
        hideGeneratingImagesDialog();  // Hide any loading dialogs
      } else if (data.status === "processing" && data.fetch_result) {
        checkImageStatus(data.fetch_result);  // Continue checking status if processing
      } else {
        showError(data);  // Show error if other statuses are encountered
      }
    })
    .catch(error => {
      showError(error);  // Catch and display errors from the fetch operation or JSON parsing
    });
  }

  function checkImageStatus(fetchResultUrl) {
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
        // Update the ETA display
        if (data.eta) {
          document.getElementById('etaValue').textContent = data.eta;
        }
        setTimeout(() => checkImageStatus(fetchResultUrl), 2000); // Check again after 2 seconds
      } else if (data.status === "success" && data.output) {
        const imageUrls = data.output.map(url =>
          url.replace("https://d1okzptojspljx.cloudfront.net", "https://modelslab.com")
        );
        showModal(imageUrls, promptText);  // Display images
        hideGeneratingImagesDialog();  // Hide any loading dialogs
        document.getElementById('etaDisplay').textContent = "Images are ready!";  // Update ETA display
      } else {
        // Handle any other statuses or errors
        showError(data);
        document.getElementById('etaDisplay').textContent = "Error processing images.";  // Update ETA display on error
      }
    })
    .catch(error => {
      console.error('Error checking image status:', error);
      showError(error);
      document.getElementById('etaDisplay').textContent = "Failed to check image status.";  // Update ETA display on fetch error
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

    // Add event listener for the dismiss button
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

  const rerollButton = document.getElementById("rerollButton");
  rerollButton.addEventListener("click", rerollImages);

  function showOverlay() {
    const overlay = document.getElementById("overlay");
    overlay.style.display = "block";
  }

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

  async function copyTextToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      generateMessageDiv("Prompt copied to clipboard!");
    } catch (err) {
      console.error('Failed to copy: ', err);
      generateMessageDiv("Failed to copy prompt to clipboard.");
    }
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
                  html { background: #15202b; }
                  body { text-align: center; color: #a9fff5; font-family: arial, sans-serif; font-size: 12px; padding-top: 60px; margin-top: 40px; }
                  h1 { margin: 20px 0; }
                  img { border-radius: 12px; overflow: hidden; max-width: 100%; }
                  img.logoRD { margin: 20px auto 0 auto; display: block; height: 50px; }
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
    const photopeaUrl = `https://www.photopea.com#`;
    const photopeaConfig = { files: [imageUrl] };
    const encodedConfig = encodeURIComponent(JSON.stringify(photopeaConfig));
    window.open(photopeaUrl + encodedConfig, '_blank');
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

      const downloadButton = createButton("Download", () => downloadImage(imageUrl));
      const copyButton = createButton("Copy URL", () => copyImageUrlToClipboard(imageUrl));
      const editButton = createButton("Edit in Photopea", () => openPhotopeaWithImage(imageUrl));
      const copyPromptButton = createButton("Copy Prompt", () => copyTextToClipboard(transformedPrompt));
      const upscaleButton = createButton("Upscale", () => upscaleImage(imageUrl));
      const compareButton = createButton("Compare", () => openComparisonWindow(userImageBase64, imageUrl));

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

  function showOverlay() {
    const overlay = document.getElementById("overlay");
    overlay.style.display = "block";
  }

  function closeModal() {
    const modal = document.getElementById("modal");
    const overlay = document.getElementById("overlay");
    modal.style.display = "none";
    overlay.style.display = "none";
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
    magicButton.disabled = false;
    resetFormAndEventListeners();
  }

  function resetFormAndEventListeners() {
    const form = document.getElementById("imageGenerationForm");
    form.reset();
    const selectElements = document.querySelectorAll("select");
    selectElements.forEach(function (select) {
      select.removeEventListener("change", handleSelectChange);
    });
    selectElements.forEach(function (select) {
      select.addEventListener("change", handleSelectChange);
    });
  }

  const form = document.getElementById("imageGenerationForm");
  form.addEventListener("submit", handleSubmit);

  const closeButton = document.getElementsByClassName("close")[0];
  closeButton.addEventListener("click", closeModal);

  const clearAllButton = document.getElementById("clearAllButton");
  clearAllButton.addEventListener("click", clearAll);

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

  const selectElements = document.querySelectorAll("select");

  function areAllOptionsEmpty() {
    for (const select of selectElements) {
      if (select.value !== "") {
        return false;
      }
    }
    return true;
  }

  function handleSelectChange() {
    const allOptionsEmpty = areAllOptionsEmpty();
    magicButton.disabled = allOptionsEmpty;
  }

  for (const select of selectElements) {
    select.addEventListener("change", handleSelectChange);
  }

  handleSelectChange();

  window.addEventListener('load', function() {
    setTimeout(function() {
      var splash = document.getElementById('splash');
      var content = document.getElementById('content');

      splash.style.transition = 'top 0.5s ease-in-out';
      splash.style.top = '-100%';

      setTimeout(function() {
        splash.style.display = 'none';
      }, 500);
    }, 4000);
  });

  document.getElementById('clearImg').addEventListener('click', function() {
    clearImage();
    document.getElementById('imageDisplayUrl').value = '';
  });

  function clearImage() {
    var thumbnail = document.getElementById('thumbnail');
    thumbnail.src = '';
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
});
