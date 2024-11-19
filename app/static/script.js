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


/*AIDESIGN
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

    
*/

 
 
// Function to handle the form submission
function handleSubmit(event) {
  event.preventDefault();

  const fileInput = document.getElementById("imageDisplayUrl");
  const file = fileInput.files[0];
  const selectedValues = getSelectedValues();
  const isImg2Img = Boolean(file);

  // Obtener el prompt y el estado del switch
  const prompt = document.getElementById("customText").value;
  const useOpenAI = document.getElementById("useOpenAI").checked; // Estado del switch

  processPrompt(prompt).then((processedPrompt) => {
    if (file) {
      const apiKey = "ba238be3f3764905b1bba03fc7a22e28";
      const uploadUrl = "https://api.imgbb.com/1/upload";
      const formData = new FormData();
      formData.append("key", apiKey);
      formData.append("image", file);

      fetch(uploadUrl, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            const imageUrl = data.data.url;
            if (imageUrl) {
              const img2imgThumbnail = document.getElementById("img2imgThumbnail");
              img2imgThumbnail.src = imageUrl;

              // Enviar datos al backend
              generateImages(imageUrl, selectedValues, isImg2Img, processedPrompt, useOpenAI);
            } else {
              handleError("La URL de la imagen no es válida. Intenta cargar la imagen nuevamente.");
            }
          } else {
            throw new Error("Error en la subida de imagen: " + data.error.message);
          }
        })
        .catch((error) => {
          console.error("Error en la subida de la imagen:", error.message);
        });
    } else {
      generateImages(null, selectedValues, isImg2Img, processedPrompt, useOpenAI);
    }
  });
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
        "shot_angle",
        "home_room",
        "design_style",
        "generated_artwork",
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
        "hairstyle_select",
        "gender",
        "age",
        "outfit",
        "shoes",
        "accessories",
         "photography_pose",
        "style_image",
        "subject_emotion"
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
    
     function generateTilt() {
    return "This scene is designed with a tilt-shift effect, which creates an illusion of a tiny model-like scene.";
}
    
    
    function generateR3d() {
    return "CINEMA_MASTER_8K_SC01_TK01.r3d";
}
    
    function generateMiniature(customText) {
    return `  picture an already painted miniature figure designed for an rpg tabletop game, styled as a fantasy ${customText} reminiscent of warhammer fantasy. this small, intricately detailed figure is positioned as if ready for battle. the  ${customText}  is adorned in traditional armor, poised with their  ${customText} weapons or tools, capturing the mythical and adventurous essence of fantasy gaming. the colors are matte, specific for the ${customText}.`;
   }
    
    
      function generateSheet() {
    return "Create a full-body turnaround of a character. Show the character from five angles: front, three-quarters front left, side left, three-quarters back left, and back. The character stands in a neutral position with their arms down by their sides.  The details of the clothing, including visible accessories should be clearly visible from each angle.";
}
    
    
   function generateEvolutionCycleEvo(customText, evolutionType) {
    return `Illustrate the ${evolutionType} of ${customText} in a single, continuous image. Divide the canvas into four seamlessly blending sections, each representing a stage of the subject's ${evolutionType}.

    Start on the left by showing the initial stage, depicting the earliest form or level of ${customText}. As we move to the right, show the next level, highlighting significant advancements or changes in ${evolutionType}, whether biological, technological, or equipment-based. In the third section, depict a further transformation stage, capturing ${customText} in a more advanced form or configuration.

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
    return ` Envision a product design for a ${customText}. The task is to create a full-product turnaround of the ${customText}, showing the product from five distinct angles: front, three-quarters front left, side left, three-quarters back left, and back. In each depiction, the ${customText} must look highly detailed. Ensure that the details of the ${customText} product details are clearly discernible from each perspective.`;
} 

    
  
function generateProductView(customText, photo_location) {
    return `Imagine a centered product photo for ${customText}, located at ${photo_location}. The image should focus on highlighting the key features of the product, ensuring it stands out clearly in a well-lit and balanced frame. The product should be centered with a neutral background, emphasizing its design and craftsmanship. The photo should reflect professional product photography standards, capturing every detail in a sharp and attractive manner.`;
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
        errorContainer.innerHTML = `
            <div style="position: relative;">
                <button id="closeButton" type="button" style="position: absolute; top: 10px; right: 10px;">x</button>
                <p>Error: ${error.message}</p>
            </div>
        `;
        errorContainer.style.display = "block";

        // Agregar el evento para cerrar el modal
        document.getElementById('closeButton').addEventListener('click', function() {
            errorContainer.style.display = 'none';
        });
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
async function fetchWithRetry(url, options, retries = 90, delay = 10000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            const data = await response.json();

            if (response.ok) {
                return data; // Respuesta exitosa
            } else {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error(`Intento ${i + 1} fallido: ${error.message}`);
            if (i === retries - 1) {
                throw error; // Lanza el error si se alcanzó el número máximo de reintentos
            }
            // Espera antes de intentar nuevamente
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
}
    
function updateCreditsDisplay(remainingCredits) {
    // Obtiene el elemento HTML donde se muestran los créditos
    const creditDisplay = document.getElementById("creditDisplay");

    // Actualiza el texto del elemento con la cantidad de créditos restantes
    creditDisplay.textContent = remainingCredits;  
}
    
    
function getModelConfig(selectedModel) {
    const models = {
       "flux": { model_id: "flux", lora_model: "", lora_strength: 0 },
        "fluxdev": { model_id: "fluxdev", lora_model: null, lora_strength: null },
        "simplevectorflux": { model_id: "fluxdev", lora_model: "simplevectorflux", lora_strength: 1 },
        "flux-detaile": { model_id: "fluxdev", lora_model: ["flux-detaile"], lora_strength: [1] },
        "fluxpro-11": { model_id: "fluxdev", lora_model: ["fluxpro-11"], lora_strength: [1] },
        "fluxdevfashion": { model_id: "fluxdev", lora_model: ["flux-fashion"], lora_strength: [1] },
        "mystic": { model_id: "mystic", lora_model: null, lora_strength: null },
        "iphone-photo-flux-realism-booster": {
            model_id: "fluxdev",
            lora_model: ["iphone-photo-flux-realism-booster"],
            lora_strength: [1],
        },
        "polyhedron-flux": { model_id: "fluxdev", lora_model: ["polyhedron-flux"], lora_strength: [1] },
        "ultrarealistic-lora-project": {
            model_id: "fluxdev",
            lora_model: ["ultrarealistic-lora-project"],
            lora_strength: [1],
        },
        "uncensored-flux-lora": { model_id: "fluxdev", lora_model: ["uncensored-flux-lora"], lora_strength: [1] },
    };

    if (!models[selectedModel]) {
        throw new Error(`Model ${selectedModel} is not defined in the configuration.`);
    }
    return models[selectedModel];
}

   
// Función para generar imágenes
async function generateImages(imageUrl, selectedValues, isImg2Img) {
    showGeneratingImagesDialog(); // Mostrar el diálogo de espera

    const customText = document.getElementById("customText").value;
    const pictureSelect = document.getElementById("imageDisplayUrl");
    const selectedPicture = pictureSelect ? pictureSelect.value : null;

    // Extraer valores seleccionados por el usuario
    let plainText = Object.entries(selectedValues)
        .filter(([key, value]) => value && key !== "imageUrl")
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");

    // Crear el prompt base y añadir información sobre colores si corresponde
    let promptEndy = "";
    if (extractedColors.length > 0) {
        const colorNames = extractedColors.map(color => color.name);
        const colorsString = colorNames.join(", ");
        promptEndy += ` Colors used: ${colorsString}.`;
    }

    // Definir proporciones de imagen basadas en la selección
    const aspectRatio = document.querySelector('input[name="aspectRatio"]:checked').value;
    let width, height;

    if (aspectRatio === "square") {
        width = 1200;
        height = 1200;
    } else if (aspectRatio === "widescreen") {
        width = 1536;
        height = 640;
    } else if (aspectRatio === "landscape") {
        width = 1344;
        height = 768;
    } else if (aspectRatio === "portrait") {
        width = 896;
        height = 1152;
    } else if (aspectRatio === "social-vertical") {
        width = 640;
        height = 1536;
    }

    console.log(`Selected Resolution: ${width}x${height}px`);

    // Configurar semilla si está activada la opción
    const seedSwitch = document.getElementById("seedSwitch");
    const seedEnabled = seedSwitch && seedSwitch.checked;
    const seedValue = seedEnabled ? null : "19071975"; // Valor predeterminado si no se usa la semilla

    // Generar textos opcionales si están habilitados
    const optionalText = document.getElementById("optionalTextCheckbox")?.checked ? generateOptionalText() : "";

    // Procesar el prompt con el switch OpenAI (use existing `useOpenAI` declaration)
    const transformedPrompt = useOpenAI ? await processPrompt(`${plainText} ${customText} ${optionalText}`) : `${plainText} ${customText} ${optionalText}`;

    // Obtener el modelo seleccionado
    const selectedModel = document.querySelector('input[name="modelType"]:checked').value;

    // Configuración del modelo basada en la selección del usuario
    let modelConfig = getModelConfig(selectedModel);

    // Ajustar lora_model y lora_strength para la API de modelslab
    const lora = Array.isArray(modelConfig.lora_model) && modelConfig.lora_model.length > 0
        ? modelConfig.lora_model[0]
        : null; // Enviar null como valor

    const loraStrength = Array.isArray(modelConfig.lora_strength) && modelConfig.lora_strength.length > 0
        ? modelConfig.lora_strength[0]
        : null; // Enviar null como valor

    // Configuración del prompt
    const prompt = {
        prompt: transformedPrompt,
        width: width,
        height: height,
        samples: 4,
        guidance_scale: 7.5,
        steps: 8,
        use_karras_sigmas: "yes",
        tomesd: "yes",
        seed: seedValue,
        model_id: modelConfig.model_id,
        lora_model: lora,
        lora_strength: loraStrength,
        scheduler: "EulerDiscreteScheduler",
        webhook: null,
        safety_checker: "no",
        track_id: null,
        enhance_prompt: "no",
        use_openai: useOpenAI
    };

    // Si es img2img, añade la imagen inicial
    if (isImg2Img && imageUrl) {
        const strengthSlider = document.getElementById("strengthSlider");
        prompt.init_image = imageUrl;
        prompt.strength = parseFloat(strengthSlider.value);
    }

    try {
        console.log("Iniciando solicitud para generar imágenes...");

        const data = await fetchWithRetry("/generate-images", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(prompt),
        });

        console.log("Respuesta del backend recibida:", data);

        if (data.images && Array.isArray(data.images) && data.images.length > 0) {
            showModal(data.images, transformedPrompt); // Mostrar imágenes
        } else if (data.request_id) {
            await checkImageStatus(data.request_id, transformedPrompt);
        } else {
            throw new Error(data.error || "Error inesperado en la generación de imágenes.");
        }
    } catch (error) {
        console.error("Error detectado en generateImages:", error);
        showError(error); // Manejo del error
    } finally {
        hideGeneratingImagesDialog(); // Ocultar el diálogo
    }
}

document.addEventListener("DOMContentLoaded", function() {
  const fileInput = document.getElementById("imageDisplayUrl");
  const thumbnailContainer = document.querySelector(".thumbImg2Img");
  const thumbnailImage = document.getElementById("img2imgThumbnail");

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




document.getElementById('clearImg').addEventListener('click', function() {
    const img2imgThumbnail = document.getElementById('img2imgThumbnail');
    
    // Limpiar el src de la miniatura
    img2imgThumbnail.src = '';
    
    // Opcional: También puedes ocultar la imagen para evitar mostrar la miniatura rota
    img2imgThumbnail.style.display = 'none'; 
    
    // Limpiar el input de URL o carga de imagen
    document.getElementById('imageDisplayUrl').value = ''; 
});



document.getElementById('clearColorImg').addEventListener('click', function() {
    const colorThumbnail = document.getElementById('colorThumbnail');
    colorThumbnail.src = '';
    document.getElementById('colorExtractionInput').value = ''; // Limpiar input de extracción de colores
});



function clearImage() {
    // Reset the src attribute of the thumbnail image
    var img2imgThumbnail = document.getElementById('img2imgThumbnail');
    img2imgThumbnail.src = '';

    // Hide the thumbnail container
    var thumbContainer = document.querySelector('.thumbImg2Img');
    thumbContainer.style.display = 'none';
}




function displayThumbnail(imageSrc) {
    var thumbnail = document.getElementById('img2imgThumbnail');
    var thumbDiv = document.querySelector('.thumbImg2Img');
    thumbnail.src = imageSrc;
    thumbDiv.style.display = 'block';
}

function clearThumbnail() {
    var thumbnail = document.getElementById('img2imgThumbnail');
    var thumbDiv = document.querySelector('.thumbImg2Img');
    thumbnail.src = '';
    thumbDiv.style.display = 'none';
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const img2imgThumbnail = document.getElementById('img2imgThumbnail');
        img2imgThumbnail.src = e.target.result;
        document.querySelector(".thumbImg2Img").style.display = 'block';
    };

    if (file) {
        reader.readAsDataURL(file);
    }
}

// Add the event listener
document.getElementById('imageDisplayUrl').addEventListener('change', handleImageUpload);


function showTab(tabName) {
    // Ocultar todas las pestañas
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Desactivar todos los botones de pestañas
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // Mostrar la pestaña seleccionada
    document.getElementById(tabName).classList.add('active');
    // Activar el botón de la pestaña seleccionada
    const activeButton = Array.from(buttons).find(button => button.textContent === tabName.charAt(0).toUpperCase() + tabName.slice(1));
    activeButton.classList.add('active');

    // Si se selecciona la pestaña de chat, enfocar el campo de entrada
    if (tabName === 'chat') {
        const chatInput = document.getElementById('chatInput');
        chatInput.focus(); // Enfocar el campo de entrada
    }
}

document.getElementById('sendChatButton').addEventListener('click', async function() {
    const chatInput = document.getElementById('chatInput');
    const imageInput = document.getElementById('imageInput');
    const message = chatInput.value;
    const image = imageInput.files[0];

    if (message || image) {
        // Mostrar el mensaje del usuario en el chat
        appendMessage('user', message || "I got the image!");
        chatInput.value = ''; // Limpiar el campo de entrada

        // Mostrar el loader
        showLoader();

        let requestData = {
            message: message,
            conversation: getConversationHistory()
        };

        if (image) {
            // Convertir la imagen a base64
            const reader = new FileReader();
            reader.onloadend = async function() {
                requestData.image = reader.result.split(',')[1]; // Obtener solo la parte de datos base64

                try {
                    const response = await fetch('/gpt-talk', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestData)
                    });

                    const data = await response.json();
                    if (data.response) {
                        // Mostrar la respuesta del asistente en el chat
                        appendMessage('assistant', data.response);
                    } else {
                        console.error('Error en la respuesta del backend:', data.error);
                    }
                } catch (error) {
                    console.error('Error al enviar el mensaje:', error);
                } finally {
                    // Ocultar el loader
                    hideLoader();
                    // Limpiar el input de imagen
                    imageInput.value = '';
                }
            };
            reader.readAsDataURL(image);
        } else {
            // Si no hay imagen, enviar solo el mensaje de texto
            try {
                const response = await fetch('/gpt-talk', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData)
                });

                const data = await response.json();
                if (data.response) {
                    // Mostrar la respuesta del asistente en el chat
                    appendMessage('assistant', data.response);
                } else {
                    console.error('Error en la respuesta del backend:', data.error);
                }
            } catch (error) {
                console.error('Error al enviar el mensaje:', error);
            } finally {
                // Ocultar el loader
                hideLoader();
            }
        }
    }
});

// Agregar evento para enviar mensaje al presionar "Enter"
document.getElementById('chatInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Evitar el comportamiento por defecto (como un salto de línea)
        document.getElementById('sendChatButton').click(); // Simular clic en el botón de enviar
    }
});


// Función para mostrar el loader
function showLoader() {
    const loader = document.getElementById('toastChat');
    loader.style.display = 'block'; // Mostrar el loader
}

// Función para ocultar el loader
function hideLoader() {
    const loader = document.getElementById('toastChat');
    loader.style.display = 'none'; // Ocultar el loader
}

// Función para agregar mensajes al contenedor de chat
function appendMessage(role, content) {
    const messagesContainer = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = role; // 'user' o 'assistant'
    messageDiv.textContent = content;
    messagesContainer.appendChild(messageDiv);
}

// Función para obtener el historial de conversación
function getConversationHistory() {
    const messages = [];
    const userMessages = document.querySelectorAll('#messages .user');
    const assistantMessages = document.querySelectorAll('#messages .assistant');

    userMessages.forEach(msg => {
        messages.push({ role: 'user', content: msg.textContent });
    });
    assistantMessages.forEach(msg => {
        messages.push({ role: 'assistant', content: msg.textContent });
    });

    return messages;
}



/*Event listener for opening the lightbox when the avatar is clicked
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
});*/