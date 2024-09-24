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
    
 // Asegúrate de que otros botones no generen imágenes
  document.querySelectorAll('button').forEach(button => {
    if (button.id !== 'magicButton') {
      button.addEventListener('click', function(event) {
        event.preventDefault();  // Previene la acción de otros botones
      });
    }
  });

  // Este es el único botón que genera imágenes
  document.getElementById('magicButton').addEventListener('click', function(event) {
    event.preventDefault();
    handleSubmit(event);  // Aquí se genera la imagen
  });


//AIDESIGN
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


    
    
     document.getElementById('aiDesignButton').addEventListener('click', function() {
   console.log("Button clicked, generating images");
   const baseValues = getSelectedValues();
   const mixedValues = mixAttributes(baseValues);
   generateImages(null, mixedValues, false);
});

    
//AIDESIGN

 
 
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

    
    
    // Obtener los elementos necesarios
const textArea = document.getElementById("customText");
const magicButton = document.getElementById("magicButton");

// Función para habilitar o deshabilitar el botón según la longitud del texto
function toggleMagicButton() {
  if (textArea.value.length >= 5) {
    magicButton.disabled = false; // Habilitar el botón si hay al menos 5 caracteres
  } else {
    magicButton.disabled = true; // Deshabilitar si hay menos de 5 caracteres
  }
}

// Escuchar el evento de entrada en el área de texto
textArea.addEventListener("input", toggleMagicButton);

// Verificar el estado inicial por si ya hay texto en el área
toggleMagicButton();
    


function getSelectedValues() {
    const elementIds = [
        "person",
        "home_room",
        "design_style",
        //"generated_artwork",
        "photography_style",
        "point_of_view",
        "color_scheme",
        "camera_select",
        "film_grain",
        "action_select",
        "person_descriptor",
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
        "decorative_elements",
        "type_select",
        "photo_location",
        "movie_still_by_genre",
        "movie_atmosphere",
      "image_style",
        "hairstyle_select",
"gender",
        "age",
        "outfit",
        "shoes",
        "accessories",
         "photography_pose",
        "style_image"
    ];

    const colorElements = [
        { id: "dominant_color", switchId: "use_colors" },
        { id: "secondary_color", switchId: "use_colors" },
        { id: "accent_color", switchId: "use_colors" },
        { id: "walls_paint_color", switchId: "use_walls_paint_color" },
        { id: "furniture_color", switchId: "use_furniture_color" }
    ];

    const values = {};

    // Capture values for general elements
    elementIds.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            values[elementId] = element.value;
        }
    });

    // Capture values for color elements
    colorElements.forEach(colorElement => {
        const colorInput = document.getElementById(colorElement.id);
        const colorSwitch = document.getElementById(colorElement.switchId);
        const colorNameSpan = document.getElementById(`${colorElement.id}_name`);

        if (colorInput && colorSwitch) {
            const updateColor = () => {
                const hexColor = colorInput.value;
                const n_match = ntc.name(hexColor);
                const colorName = n_match[1]; // Only the color name

                if (colorSwitch.checked) {
                    values[colorElement.id] = `${colorName} (${hexColor})`; // Save the color name and HEX
                    colorNameSpan.textContent = colorName; // Display the color name under the picker
                } else {
                    values[colorElement.id] = ""; // Assign an empty value if the switch is off
                    colorNameSpan.textContent = ""; // Clear the displayed color name
                }
            };

            // Listen for changes in the color input and the checkbox
            colorInput.addEventListener('input', updateColor);
            colorSwitch.addEventListener('change', updateColor);

            // Initialize the color name when the page loads
            updateColor();
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
      return "Architecture and furniture with rounded and organic shapes. Highlight smooth, flowing forms in modern, minimalist designs. Include elements such as rounded walls, curved facades, and organically shaped windows in architecture, and round tables, curved sofas, and organically inspired chairs in furniture. Use soft, natural lighting to emphasize textures and curves.";
    }
 //Function to generate fractal
function generateFractalText() {
  return "Architecture and furniture with fractal patterns and details. Highlight intricate, repeating patterns that exhibit fractal and self-similar qualities. Use modern, minimalist designs.";
    }
    
function generateBlurredBackground () {
    return "The background blurs intricately, adding to the scene's stunning beauty.";
}
    
    function generateBokehBackground() {
    return "The background transforms with a beautiful bokeh effect, enhancing the visual appeal of the scene.";
}
    
      function generateSheet() {
    return "Create a full-body turnaround of a character. Show the character from five angles: front, three-quarters front left, side left, three-quarters back left, and back. The character stands in a neutral position with their arms down by their sides.  The details of the clothing, including visible accessories should be clearly visible from each angle.";
}
    
    
   function generateEvolutionCycleEvo(customText, evolutionType) {
    return `Illustrate the ${evolutionType} of ${customText} in a single, continuous image. Divide the canvas into four seamlessly blending sections, each representing a stage of the subject's ${evolutionType}.

    Start on the left by showing the initial stage, depicting the earliest form or level of ${customText}. As we move to the right, show the next level, highlighting significant advancements or changes in ${evolutionType}, whether biological, technological, or equipment-based. In the third section, depict a further evolution stage, capturing ${customText} in a more advanced form or configuration.

    Finally, on the right side, show the fully developed form of ${customText}, presenting the final stage of its ${evolutionType}. The design should seamlessly transition from one stage to the next, ensuring a coherent flow. The background should subtly shift to reflect the progression, using changes in lighting, scenery, or other visual cues to indicate the passage of time or advancement of technology.`;
}
    
    
    //for evo only

function generateEvo() {
    // Obtener el texto personalizado
    const customText = document.getElementById('customText').value || "a generic subject";
    
    // Obtener el tipo de evolución seleccionado
    const evolutionType = document.querySelector('input[name="evolutionType"]:checked').value;
    
    // Generar el prompt usando la función
    return generateEvolutionCycleEvo(customText, evolutionType);
}


    
    
       function generateUxui(customText) {
    return ` imagine designing a sleek, modern mobile app interface for a ${customText} App. this user friendly user interface, must show a well distributed dashboard and ui cards. should feature intuitive UI icons, UI buttons and text options to enhance the user experience. the design approach combines this project involves UI design, UX/UI design, Product Design, App design.`;
}

    
    
   function generateUxuiWeb(customText) {
    return `Imagine designing a sleek, modern hero section for a landing page dedicated to ${customText}. This hero section should focus on capturing the user's attention with a clean and appealing design, highlighting key elements such as a bold headline, clear subtitles, and a conversion-focused call to action (CTA). The design should integrate high-quality images or graphics, all optimized for a smooth and effective user experience. This project covers UI design, UX/UI design, product design, and web design.`;
}

    function generateViewRendering(customText) {
    return `Imagine a sleek, modern product like *${customText}*, displayed in a 360-degree view with four distinct angles. The product should  be positioned at front, back, left, and right perspectives, providing a comprehensive view of the item's design, structure, and details. The focus is on showcasing the product’s features   to highlight its aesthetics and functionality. Detailed visual exploration. 3D render. `;
}

    
    function generateViewRendering(customText) {
    return `Imagine a sleek, modern product like *${customText}*, displayed in a 360-degree view with four distinct angles. The product should  be positioned at front, back, left, and right perspectives, providing a comprehensive view of the item's design, structure, and details. The focus is on showcasing the product’s features   to highlight its aesthetics and functionality. Detailed visual exploration. 3D render. `;
}
    
function generateProductView(customText, photo_location) {
    return `Imagine a centered product photo for ${customText}, located at ${photo_location}. The image should focus on highlighting the key features of the product, ensuring it stands out clearly in a well-lit and balanced frame. The product should be centered with a neutral background, emphasizing its design and craftsmanship. The photo should reflect professional product photography standards, capturing every detail in a sharp and attractive manner.`;
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

// COLORSEX

    let extractedColors = [];

document.getElementById("colorExtractionInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const colorThumbnail = document.getElementById("colorThumbnail");
            colorThumbnail.src = e.target.result;

            const img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                const colorThief = new ColorThief();
                const palette = colorThief.getPalette(img, 5); // Extrae la paleta de colores

                // Convierte los colores a HEX y luego a nombres, almacenando ambos
                extractedColors = palette.map(rgbArray => {
                    const hexColor = rgbToHex(rgbArray[0], rgbArray[1], rgbArray[2]);
                    const n_match = ntc.name(hexColor);
                    return {
                        name: n_match[1],  // Guardamos el nombre del color
                        hex: hexColor      // Guardamos el código HEX
                    };
                });

                // Mostrar los colores extraídos con nombres
                displayExtractedColors(extractedColors);
                console.log("Extracted Color Names and HEX:", extractedColors);
            };

            const colorThumbContainer = document.querySelector("#colorExtractionImage .thumbImg");
            colorThumbContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function displayExtractedColors(colors) {
    const colorContainer = document.querySelector('.thumbExt');
    colorContainer.innerHTML = ''; // Limpiar cualquier color previo
    colors.forEach(color => {
        const colorCircle = document.createElement('div');
        
        // Usamos el HEX para establecer el color de fondo
        const hexColor = color.hex;
        const colorName = color.name;

        colorCircle.style.backgroundColor = hexColor;
        colorCircle.style.width = '100%';
colorCircle.style.height = '40px';
colorCircle.style.display = 'flex';
colorCircle.style.border = '1px solid #777777';
colorCircle.style.flexDirection = 'column';
colorCircle.style.justifyContent = 'flex-start';
colorCircle.style.alignItems = 'center';

        const colorLabel = document.createElement('span');
        colorLabel.textContent = colorName;
        colorLabel.style.display = 'block';
        colorLabel.style.textAlign = 'center';
        colorLabel.style.fontSize = '12px';

        const colorWrapper = document.createElement('div');
        colorWrapper.style.display = 'inline-block';
        colorWrapper.style.marginRight = '10px';
        colorWrapper.style.textAlign = 'center';
        colorWrapper.appendChild(colorCircle);
        colorWrapper.appendChild(colorLabel);

        colorContainer.appendChild(colorWrapper);
    });
}

document.getElementById('clearColorImg').addEventListener('click', function() {
    clearColorImage();
    extractedColors = []; // Limpiar colores extraídos
    console.log("Extracted Color Names and HEX cleared:", extractedColors);

    document.getElementById('colorExtractionInput').value = '';
});

function clearColorImage() {
    const colorThumbnail = document.getElementById('colorThumbnail');
    colorThumbnail.src = '';

    const colorThumbContainer = document.querySelector("#colorExtractionImage .thumbImg");
    colorThumbContainer.style.display = 'none';

    const colorContainer = document.querySelector('.thumbExt');
    colorContainer.innerHTML = '';
}


// END COLORSEX
    

//🔶    start gen img
 //Función para mostrar errores
function showError(error) {
    console.error("Error generating images:", error);
    
    const errorContainer = document.getElementById("errorContainer");
    if (errorContainer) {
        errorContainer.innerHTML = `<p>Error: ${error.message}</p>`;
        errorContainer.style.display = "block";
    } else {
        alert("Error: " + error.message); // Mensaje de alerta en caso de error
    }

    hideGeneratingImagesDialog(); // Asegúrate de que esta función esté definida si quieres ocultar el diálogo de espera en caso de error
}

// Función para ocultar el diálogo de generación de imágenes
function hideGeneratingImagesDialog() {
    const dialog = document.getElementById("generatingImagesDialog");
    if (dialog) {
        dialog.style.display = "none";
    }
}

// Función genérica para hacer fetch con reintentos
// Función genérica para hacer fetch con reintentos
async function fetchWithRetry(url, options, retries = 5, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            const data = await response.json();

            if (response.ok) {
                return data;
            } else {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error(`Intento ${i + 1} fallido: ${error.message}`);
            if (i === retries - 1) {
                throw error; // Lanza el error si se alcanzó el número máximo de reintentos
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// Función para generar imágenes
async function generateImages(imageUrl, selectedValues, isImg2Img) {
    showGeneratingImagesDialog();  // Mostrar el diálogo de espera

    const customText = document.getElementById("customText").value;
 const pictureSelect = document.getElementById("imageDisplayUrl");
  const selectedPicture = pictureSelect.value;
    // Extraer valores seleccionados por el usuario
    let plainText = Object.entries(selectedValues)
        .filter(([key, value]) => value && key !== "imageUrl")
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");

    // Crear el prompt base y añadir información sobre colores si corresponde
    let promptEndy = "";
    if (extractedColors.length > 0) {
        const colorNames = extractedColors.map(color => color.name);
        const colorsString = colorNames.join(', ');
        promptEndy += ` Colors used: ${colorsString}.`;
    }

    // Definir proporciones de imagen basadas en la selección
    const aspectRatio = document.querySelector('input[name="aspectRatio"]:checked').value;
    let width, height;
    if (aspectRatio === "landscape") {
        width = 1024;
        height = 768;
    } else if (aspectRatio === "portrait") {
        width = 768;
        height = 1024;
    } else if (aspectRatio === "square") {
        width = 1024;
        height = 1024;
    }

    // Configurar semilla si está activada la opción
    const seedSwitch = document.getElementById("seedSwitch");
    const seedEnabled = seedSwitch.checked;
    const seedValue = seedEnabled ? null : "19071975";  // Valor predeterminado si no se usa la semilla

    // Generar textos opcionales si están habilitados
    const optionalText = document.getElementById("optionalTextCheckbox").checked ? generateOptionalText() : "";
    const fractalText = document.getElementById("fractalTextCheckbox").checked ? generateFractalText() : "";
    const blurredBackground = document.getElementById("blurredTextCheckbox").checked ? generateBlurredBackground() : "";
    const bokehBackground = document.getElementById("bokehCheckbox").checked ? generateBokehBackground() : "";
    const sheet = document.getElementById("sheetCheckbox").checked ? generateSheet() : "";
    const uxui = document.getElementById("uxuiCheckbox").checked ? generateUxui() : "";
 const uxuiWeb = document.getElementById("uxuiWebCheckbox").checked ? generateUxuiWeb() : "";
     const viewRendering = document.getElementById("viewRenderingCheckbox").checked ? generateViewRendering() : "";

     const productView = document.getElementById("productViewCheckbox").checked ? generateProductView() : "";
    
  

// Modificar la línea que crea evolutionCycle
const evolutionCycle = document.getElementById("evolutionCycleCheckbox").checked ? generateEvo() : "";


    // Construir el texto del prompt final
    const promptText = `Imagine ${plainText} ${customText} ${fractalText} ${blurredBackground} ${bokehBackground} ${sheet} ${evolutionCycle}  ${uxui} ${uxuiWeb}  ${viewRendering} ${productView} ${promptEndy} ${optionalText}`;

    // Configuración del modelo (ajustable según la selección del usuario)
    const prompt = {
        prompt: promptText,
        negative_prompt: "multiple people, two persons, duplicate, cloned face, extra arms, extra legs, extra limbs, multiple faces, deformed face, deformed hands, deformed limbs, mutated hands, poorly drawn face, disfigured, long neck, fused fingers, split image, bad anatomy, bad proportions, ugly, blurry, text, low quality",
        width: width,
        height: height,
        samples: 4,
        guidance_scale: 7.5,
        steps: 41,
        use_karras_sigmas: "yes",
        tomesd: "yes",
        seed: seedValue,
        model_id: "fluxdev",  // El modelo predeterminado
        lora_model: "flux-fashion,surreal-photorealism,Photorealism-flux,realistic-skin-flux",
        lora_strength: "0.5,1,0.7,0.8", 
        clip_skip: 2,
        algorithm_type: "dpmsolver+++",
        scheduler: "DDPMScheduler",
        webhook: null,
        safety_checker: "no",
        track_id: null,
        enhance_prompt: "no"
    };

    // Si es una generación img2img, agregar la imagen inicial
    if (isImg2Img && imageUrl) {
        prompt.init_image = imageUrl;
        const strengthSlider = document.getElementById("strengthSlider");
        prompt.strength = parseFloat(strengthSlider.value);
    }

    let transformedPrompt;  // Declara transformedPrompt fuera del try

    
    try {
        // Enviar solicitud al backend en lugar de a la API externa
        const data = await fetchWithRetry("/generate-images", {  // Cambiamos la URL a la del backend
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(prompt)
        });

        console.log('Respuesta del backend en generateImages:', data);

        if (data.status === "success" && data.images) {
            transformedPrompt = data.transformed_prompt;  // Captura transformedPrompt
            // Las imágenes están listas
            showModal(data.images, transformedPrompt);  // Pasa transformedPrompt
            hideGeneratingImagesDialog();  // Ocultar el diálogo de espera
        } else if (data.request_id) {
            transformedPrompt = data.transformed_prompt;  // Captura transformedPrompt
            // Las imágenes aún se están procesando, iniciar polling
            await checkImageStatus(data.request_id, transformedPrompt);  // Pasa transformedPrompt
        } else {
            throw new Error(data.error || 'Error inesperado en la generación de imágenes.');
        }
    } catch (error) {
        showError(error);  // Manejo de errores
    }
}

// Polling para verificar el estado de la generación de imágenes
async function checkImageStatus(requestId, transformedPrompt, retries = 40, delay = 10000) {
    try {
        // Enviar solicitud al backend en lugar de a la API externa
        const data = await fetchWithRetry("/fetch-images", {  // Cambiamos la URL a la del backend
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                request_id: requestId  // Enviamos solo el request_id
            })
        });

        console.log('Respuesta del backend en checkImageStatus:', data);

        if (data.status === 'processing') {
            if (retries > 0) {
                console.log(`Procesando... reintentando en ${delay / 1000} segundos. Reintentos restantes: ${retries}`);
                setTimeout(() => checkImageStatus(requestId, transformedPrompt, retries - 1, delay), delay);
            } else {
                throw new Error('La generación de imágenes está tomando demasiado tiempo. Por favor, intenta de nuevo más tarde.');
            }
        } else if (data.status === "success" && data.images) {
             
            // Las imágenes están listas
            showModal(data.images, transformedPrompt);  // Mostrar las imágenes generadas
            hideGeneratingImagesDialog();  // Ocultar el diálogo de espera
        } else {
            throw new Error(data.error || 'Estado inesperado recibido del servidor.');
        }
    } catch (error) {
        console.error('Error al verificar el estado de las imágenes:', error);
        showError(error);
    }
}


function showGeneratingImagesDialog() {
    // Mostrar el diálogo
    const dialog = document.getElementById('generatingImagesDialog');
    if (dialog) {
        dialog.style.display = 'block';
    } else {
        console.error("No se encontró el elemento con id 'generatingImagesDialog'");
        return;
    }

    // Establecer el contenido inicial del diálogo
    const dialogTitle = document.getElementById('dialogTitle');
    if (dialogTitle) {
        dialogTitle.innerHTML = `
            <h2 id="changingText">painting walls</h2>
            <p>Sit back and relax, your design will be ready soon.<br>It takes some time to make it perfect.</p>
            <p id="chronometer">00:00:00</p>
        `;
    } else {
        console.error("No se encontró el elemento con id 'dialogTitle'");
    }

    // Lista de mensajes que van cambiando
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
        if (!chronometer) {
            console.error("No se encontró el elemento con id 'chronometer'");
            return;
        }
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
        if (!changingText) {
            console.error("No se encontró el elemento con id 'changingText'");
            return;
        }
        
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

// Event listener para el botón de cerrar
document.getElementById('closeDialogButton').addEventListener('click', function() {
    const dialog = document.getElementById('generatingImagesDialog');
    if (dialog) {
        dialog.style.display = 'none';
    }
});


    
//🔸    end genimg
    

    
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
    

    /*Function to copy text to clipboard
    function copyTextToClipboard(text) {
      const tempInput = document.createElement("textarea");
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      
      generateMessageDiv("Prompt copied to clipboard!");
    }
    */
    
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

    
    
function clarityUpscale(imageUrl) {
    fetch('/clarity-upscale', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            image_url: imageUrl  // Solo se envía la URL de la imagen
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (Array.isArray(data.output) && data.output.length > 0) {
            // Abre la primera URL del array en una nueva pestaña
            window.open(data.output[0], '_blank');
        } else {
            console.error('No URLs received for the processed image.');
        }
    })
    .catch(error => {
        console.error('Error during image upscaling:', error);
    });
}



    



//reverse
    
// Function to search an image on RapidAPI and display results in a new tab
async function searchImageOnRapidAPI(imageUrl) {
    const url = `https://reverse-image-search-by-copyseeker.p.rapidapi.com/?imageUrl=${encodeURIComponent(imageUrl)}`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '397b9622b6mshdcad3d01de5d22fp110064jsn7b977be6f115',
            'X-RapidAPI-Host': 'reverse-image-search-by-copyseeker.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        displayResultsInNewTab(result);
    } catch (error) {
        console.error('Error:', error);
    }
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
                
                p {
                    text-align: center;
                    color: #6d7b87;
                    font-family: courier;
                }
                p a {
                    font-size: 16px;
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


.card-container {
    column-count: 4; /* Number of columns */
    column-gap: 20px;
    padding: 20px;
}

.card {
    break-inside: avoid;
    margin-bottom: 20px;
    display: inline-block;
    width: 100%;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    color: #6d7b87;
    font-family: courier;
    font-size: 14px;
}

.maskImage {
    height: auto;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    overflow: hidden;
    width: 100%;
}

.maskImage img {
    width: 100%;
    height: auto;
    border-radius: 4px;
}
            </style>
        </head>
        <body>
            <img class="logoRD" src="https://roomdesaigner.onrender.com/static/img/logo_web_dark.svg">
            <h1 class="headerStore">Image Search Results</h1>
            <p>For refined product search, download the desired image, <a href="https://lens.google.com/search?ep=subb&re=df&p=AbrfA8pD_XRKs4Uk9azAVO5kckRoS9BffYYqJCUAtcFI-L6CDrn-F6GbtF1ugO9JjR7NCiQx_fRUl7j7uInPEIsCAU5bqRfLb2H64GxcuUEVz04AdAl07SuomVAiFja96VxMDK3q2aahJHwPRX_eKJ6sXMkl-KxprRofgMz7dqPPewM0habspTYyyyRJyozlmT7xHPXCR5JWo8gciq0Sz6-R2xE_Y75025eluHD5o4kcf0RB6y62vkoMB1GIuRMPKvmAExpqeJ_jAvs5pwXxIiCo49Z9qnP_7g%3D%3D#lns=W251bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsIkVrY0tKR0kwTUdFek16WXpMV05oWW1JdE5EYzJaQzFpTVdJMExUQmxNbU14WVRNeFpEWTROeElmYTNwR2NHMW5NVzlsVTFsVWIwUk1aa3hPVEZCZlpWQTJhRlUwT1Rkb1p3PT0iXQ==" target="_blank"> upload it here</a> and start searching for specific products</p>
            <div class="card-container">
                ${data.VisuallySimilar.map(match => `
                    <div class="card">
                        <div class="maskImage">
                            <img src="${match}" alt="Thumbnail">
                        </div>
                    </div>
                `).join('')}
            </div>
        </body>
        </html>
    `;
    newWindow.document.write(htmlContent);
    newWindow.document.close();
}

    //end reverse



  //compare
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
//end compare


 
    
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
    
    
    function createButton(text, onClickHandler) {
    const button = document.createElement("button");
    button.textContent = text;
    button.type = "button";  // Agregar type="button"
    button.addEventListener("click", onClickHandler);
    return button;
}


    // Crear estructura del carrusel
    const carouselWrapper = document.createElement("div");
    carouselWrapper.classList.add("carousel-wrapper");

    imageUrls.forEach((imageUrl, index) => {
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("carousel-slide");
        
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
        const clarityButton = createButton("Clarity Upscale", () => clarityUpscale(imageUrl));
        const compareButton = createButton("Compare", () => openComparisonWindow(userImageBase64, imageUrl));
        const searchSimilarImagesButton = createButton("Search Similar Images", () => searchImageOnRapidAPI(imageUrl));

        [downloadButton, copyButton, editButton, copyPromptButton, clarityButton, compareButton, searchSimilarImagesButton].forEach(button => buttonsContainer.appendChild(button));

        imageContainer.appendChild(image);
        imageContainer.appendChild(buttonsContainer);

        carouselWrapper.appendChild(imageContainer);
    });

    imageGrid.appendChild(carouselWrapper);

    // Crear botones prev y next para controlar el carrusel
const prevButton = document.createElement("button");
prevButton.type = "button";  // Agregar type="button" para evitar que actúe como submit
prevButton.classList.add("prev");
prevButton.innerHTML = "&#10094;";
prevButton.addEventListener("click", () => moveSlide(-1));

const nextButton = document.createElement("button");
nextButton.type = "button";  // Agregar type="button" para evitar que actúe como submit
nextButton.classList.add("next");
nextButton.innerHTML = "&#10095;";
nextButton.addEventListener("click", () => moveSlide(1));

    imageGrid.appendChild(prevButton);
    imageGrid.appendChild(nextButton);

    const toggleContentDiv = document.querySelector(".toggle-content");
    if (toggleContentDiv) {
        toggleContentDiv.innerHTML = transformedPrompt;
    } else {
        console.error("Toggle content div not found.");
    }

    modal.style.display = "block";
    showOverlay();

    // Inicializar el índice del carrusel
    let currentIndex = 0;

    function moveSlide(direction) {
        const slides = document.querySelectorAll('.carousel-slide');
        const totalSlides = slides.length;

        // Actualiza el índice actual
        currentIndex = (currentIndex + direction + totalSlides) % totalSlides;
        
        // Mueve el carrusel
        const offset = -currentIndex * 100;
        carouselWrapper.style.transform = `translateX(${offset}%)`;
    }
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

const hiddenInputs = document.querySelectorAll('input[type="hidden"]');

// Function to check if all hidden input options have empty values
function areAllOptionsEmpty() {
  for (const input of hiddenInputs) {
    if (input.value !== "") {
      return false; // At least one hidden input has a non-empty value
    }
  }
  return true; // All options have empty values
}

// Function to handle changes in hidden input elements
function handleInputChange() {
  const allOptionsEmpty = areAllOptionsEmpty();
  magicButton.disabled = allOptionsEmpty; // Disable magicButton if all options have empty values
}

// Listen for changes in hidden input elements
for (const input of hiddenInputs) {
  input.addEventListener("change", handleInputChange);
}

// Initial check on page load
handleInputChange();

// Add event listeners for custom dropdowns
document.querySelectorAll('.custom-dropdown .option').forEach(option => {
  option.addEventListener('click', function() {
    const dropdown = this.closest('.custom-dropdown');
    const selectedText = dropdown.querySelector('.selected-text');
    const hiddenInput = dropdown.querySelector('input[type="hidden"]');
    
    selectedText.textContent = this.textContent;
    hiddenInput.value = this.getAttribute('value');
    hiddenInput.dispatchEvent(new Event('change')); // Trigger change event
  });
});

// Add event listeners for clear selection buttons
document.querySelectorAll('.custom-dropdown .clear-selection').forEach(button => {
  button.addEventListener('click', function() {
    const dropdown = this.closest('.custom-dropdown');
    const selectedText = dropdown.querySelector('.selected-text');
    const hiddenInput = dropdown.querySelector('input[type="hidden"]');
    
    selectedText.textContent = dropdown.getAttribute('data-placeholder');
    hiddenInput.value = '';
    hiddenInput.dispatchEvent(new Event('change')); // Trigger change event
  });
});


//try

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

//document.getElementById('imageDisplayUrl').addEventListener('change', handleImageUpload);




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