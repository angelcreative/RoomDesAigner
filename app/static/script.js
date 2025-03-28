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


    /*
    document.getElementById("magicButton").addEventListener("click", function () {
    const generatingImagesDialog = document.getElementById("generatingImagesDialog");
    if (generatingImagesDialog) {
        // Agregar contenido al modal si está vacío
        if (!generatingImagesDialog.innerHTML.trim()) {
            generatingImagesDialog.innerHTML = `
                <h2>Connecting to ADEM...</h2>
                <p>Please wait while we prepare your creative experience.</p>
            `;
        }
        generatingImagesDialog.style.display = "block"; // Muestra el modal
    } else {
        console.error("No se encontró el modal con id 'generatingImagesDialog'");
    }
});
*/

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
  const useOpenAI = document.getElementById("useOpenAI").checked;

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
      // Verificar si es google-imagen-3
      const selectedModel = document.querySelector('input[name="modelType"]:checked').value;
      
      // Solo usar google-imagen-3 si está seleccionado Y el prompt menciona una persona
      if (selectedModel === 'google-imagen-3' && 
          (processedPrompt.toLowerCase().includes('person') || 
           processedPrompt.toLowerCase().includes('woman') || 
           processedPrompt.toLowerCase().includes('man') ||
           processedPrompt.toLowerCase().includes('girl') ||
           processedPrompt.toLowerCase().includes('boy') ||
           // Añadir más palabras clave de persona según necesites
           /from\s+[a-z]+/i.test(processedPrompt))) {  // Detecta patrones como "from spain", "from china", etc.
        
        // Mostrar el modal de carga
        showGeneratingImagesDialog();
        
        fetch('/generate-imagen3', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt: processedPrompt,
            film_type: 'google/imagen-3',
            use_openai: useOpenAI,  // Añadir el estado del switch OpenAI
            params: {
              "aspect_ratio": "1:1",
              "safety_filter_level": "block_only_high"
            }
          })
        })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'succeeded') {
            // Ocultar el modal de carga cuando la imagen está lista
            hideGeneratingImagesDialog();
            const imageGrid = document.getElementById('imageGrid');
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';
            const img = document.createElement('img');
            img.src = data.image_url;
            imageContainer.appendChild(img);
            imageGrid.appendChild(imageContainer);
            addImageButtons(imageContainer, data.image_url);
          }
        })
        .catch(error => {
          console.error('Error:', error);
          handleError(error.message);
          hideGeneratingImagesDialog();
        });
      } else {
        // Usar la lógica original para otros modelos
        generateImages(null, selectedValues, isImg2Img, processedPrompt, useOpenAI);
      }
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
        // Verificar si existe el elemento .colorPickersGroup
        const colorPickersGroup = this.closest('.colorPickersGroup');
        if (colorPickersGroup) {
            const colorPickers = colorPickersGroup.querySelectorAll('.colorPicker');
            colorPickers.forEach(picker => {
                picker.disabled = !this.checked;
            });
        } else {
            console.warn(`No se encontró '.colorPickersGroup' para el switch con ID: ${this.id}`);
        }
    });
});

// Ensure color pickers are enabled/disabled on page load based on switch state
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.switchContainer input[type="checkbox"]').forEach(switchElement => {
        // Verificar si existe el elemento .colorPickersGroup
        const colorPickersGroup = switchElement.closest('.colorPickersGroup');
        if (colorPickersGroup) {
            const colorPickers = colorPickersGroup.querySelectorAll('.colorPicker');
            colorPickers.forEach(picker => {
                picker.disabled = !switchElement.checked;
            });
        } else {
            console.warn(`No se encontró '.colorPickersGroup' para el switch con ID: ${switchElement.id}`);
        }
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

    
function updateCreditsDisplay(remainingCredits) {
    // Obtiene el elemento HTML donde se muestran los créditos
    const creditDisplay = document.getElementById("creditDisplay");

    // Actualiza el texto del elemento con la cantidad de créditos restantes
    creditDisplay.textContent = remainingCredits;  
}
    
    
function getModelConfig(selectedModel) {
    const models = {
        "google-imagen-3": {
            model_id: "google-imagen-3",
            lora_model: null,
            lora_strength: null,
            steps: 30  // Valor por defecto para imagen-3
        },
        "flux": { 
            model_id: "flux", 
            lora_model: null, 
            lora_strength: null,
            steps: 8  // Solo flux usa 8 steps
        },
        "simplevectorflux": { 
            model_id: "fluxdev", 
            lora_model: "simplevectorflux", 
            lora_strength: "1",
            steps: 28  // Usa fluxdev, por lo tanto 28 steps
        },
     "fluxdev": { 
            model_id: "fluxdev", 
            lora_model: null, 
            lora_strength: null,
            steps: 28  // Usa fluxdev, por lo tanto 28 steps
        },
        "fluxpro-11": { 
            model_id: "fluxdev", 
            lora_model: "fluxpro-11,polyhedron-flux,ultrarealistic-lora-project", 
            lora_strength: "0.7,0.3,0.3",
            steps: 28  // Usa fluxdev, por lo tanto 28 steps
        },
        "fluxdevfashion": { 
            model_id: "fluxdev", 
            lora_model: "flux-fashion,polyhedron-flux", 
            lora_strength: "0.7,0.3",
            steps: 28  // Usa fluxdev, por lo tanto 28 steps
        },
        "iphone-photo-flux-realism-booster": { 
            model_id: "fluxdev",
            lora_model: "iphone-photo-flux-realism-booster,polyhedron-flux,ultrarealistic-lora-project",
            lora_strength: "0.7,0.3,0.3",
            steps: 28  // Usa fluxdev, por lo tanto 28 steps
        },
        "uncensored-flux-lora": { 
            model_id: "fluxdev", 
            lora_model: "uncensored-flux-lora,polyhedron-flux,ultrarealistic-lora-project", 
            lora_strength: "0.7,0.3,0.3",
            steps: 28  // Usa fluxdev, por lo tanto 28 steps
        },
        "flux-pro-1.1-ultra": { 
            model_id: "flux-pro-1.1-ultra", 
            lora_model: null, 
            lora_strength: null,
            steps: 28  // No es flux base, por lo tanto 28 steps
        },
    };

    if (!models[selectedModel]) {
        throw new Error(`Model ${selectedModel} is not defined in the configuration.`);
    }
    return models[selectedModel];
}

   
// Función para generar imágenes
async function generateImages(imageUrl, selectedValues, isImg2Img, processedPrompt, useOpenAI) {
    showGeneratingImagesDialog();

    const customText = document.getElementById("customText").value;
    const pictureSelect = document.getElementById("imageDisplayUrl");
    const selectedPicture = pictureSelect ? pictureSelect.value : null;

    // Extraer valores seleccionados por el usuario
    let plainText = Object.entries(selectedValues)
        .filter(([key, value]) => value && key !== "imageUrl")
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");

    // Obtener el modelo seleccionado
    const selectedModel = document.querySelector('input[name="modelType"]:checked').value;
    
    // Si es google-imagen-3, usar su endpoint específico
    if (selectedModel === 'google-imagen-3') {
        try {
            const response = await fetch('/generate-imagen3', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: processedPrompt,
                    film_type: 'google/imagen-3',
                    use_openai: useOpenAI,  // Añadir el estado del switch OpenAI
                    params: {
                        "aspect_ratio": "1:1",
                        "safety_filter_level": "block_only_high"
                    }
                })
            });
            
            const data = await response.json();
            if (data.status === 'succeeded') {
                hideGeneratingImagesDialog();
                const imageGrid = document.getElementById('imageGrid');
                const imageContainer = document.createElement('div');
                imageContainer.className = 'image-container';
                const img = document.createElement('img');
                img.src = data.image_url;
                imageContainer.appendChild(img);
                imageGrid.appendChild(imageContainer);
                addImageButtons(imageContainer, data.image_url);
            }
            return;
        } catch (error) {
            console.error('Error:', error);
            handleError(error.message);
            hideGeneratingImagesDialog();
            return;
        }
    }

    // Configuración del modelo basada en la selección del usuario
    let modelConfig = getModelConfig(selectedModel);
    
    // Definir proporciones de imagen basadas en la selección
    const aspectRatio = document.querySelector('input[name="aspectRatio"]:checked').value;
    let width, height;
    
    if (aspectRatio === "square") {
        width = 1024;
        height = 1024;
    } else if (aspectRatio === "widescreen") {
        width = 1440;
        height = 456;
    } else if (aspectRatio === "landscape") {
        width = 1024;
        height = 768;
    } else if (aspectRatio === "portrait") {
        width = 768;
        height = 1024;
    } else if (aspectRatio === "social-vertical") {
        width = 800;
        height = 1440;
    }

    // Configurar semilla si está activada la opción
    const seedSwitch = document.getElementById("seedSwitch");
    const seedEnabled = seedSwitch && seedSwitch.checked;
    const seedValue = seedEnabled ? null : "19071975";

    // Generar textos opcionales si están habilitados
    const optionalText = document.getElementById("optionalTextCheckbox")?.checked ? generateOptionalText() : "";
    const fractalText = document.getElementById("fractalTextCheckbox")?.checked ? generateFractalText() : "";
    const blurredBackground = document.getElementById("blurredTextCheckbox")?.checked ? generateBlurredBackground() : "";
    const bokehBackground = document.getElementById("bokehCheckbox")?.checked ? generateBokehBackground() : "";
    const sheet = document.getElementById("sheetCheckbox")?.checked ? generateSheet() : "";
    const miniature = document.getElementById("miniatureCheckbox")?.checked ? generateMiniature() : "";
    const tilt = document.getElementById("tiltCheckbox")?.checked ? generateTilt() : "";
    const uxui = document.getElementById("uxuiCheckbox")?.checked ? generateUxui() : "";
    const uxuiWeb = document.getElementById("uxuiWebCheckbox")?.checked ? generateUxuiWeb() : "";
    const viewRendering = document.getElementById("viewRenderingCheckbox")?.checked ? generateViewRendering() : "";
    const productView = document.getElementById("productViewCheckbox")?.checked ? generateProductView() : "";
    const evolutionCycle = document.getElementById("evolutionCycleCheckbox")?.checked ? generateEvo() : "";
    const r3d = document.getElementById("r3dCheckbox")?.checked ? generateR3d() : "";

    // Construir el texto del prompt final
    const promptText = `${plainText} ${customText} ${fractalText} ${blurredBackground} ${bokehBackground} ${miniature} ${sheet} ${tilt} ${evolutionCycle} ${uxui} ${r3d} ${uxuiWeb} ${viewRendering} ${productView} ${optionalText}`;

    // Configuración del prompt
    const prompt = {
        prompt: promptText,
        width: width,
        height: height,
        samples: 4,
        guidance_scale: 7.5,
        steps: modelConfig.steps,
        model_id: modelConfig.model_id,  // Añadir el model_id al payload
        use_karras_sigmas: "yes",
        tomesd: "yes",
        seed: seedValue,
        lora_model: modelConfig.lora_model,
        lora_strength: modelConfig.lora_strength,
        scheduler: "EulerDiscreteScheduler",
        safety_checker: "no",
        enhance_prompt: "no",
        use_openai: useOpenAI
    };

    // Si es img2img, añadir la configuración correspondiente
    if (isImg2Img && imageUrl) {
        const strengthSlider = document.getElementById("strengthSlider");
        prompt.init_image = imageUrl;
        prompt.strength = parseFloat(strengthSlider.value);
    }

    try {
        const data = await fetchWithRetry("/generate-images", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(prompt)
        });

        if (data.status === "success" && data.images) {
            showModal(data.images, promptText);
            hideGeneratingImagesDialog();
        } else if (data.request_id) {
            await checkImageStatus(data.request_id, promptText);
        } else {
            throw new Error(data.error || 'Error inesperado en la generación de imágenes.');
        }
    } catch (error) {
        showError(error);
    }
}

    
    
// Polling para verificar el estado de la generación de imágenes

async function checkImageStatus(requestId, transformedPrompt, retries = 90, delay = 10000) {

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
            <p>Images will be ready in a minute or two</p>
            <p id="chronometer">00:00:00</p>
        `;
    } else {
        console.error("No se encontró el elemento con id 'dialogTitle'");
    }

    // Lista de mensajes que van cambiando
    const changingMessages = [
    'casting spells of creation', 'weaving enchanted visions', 'shaping mystical worlds', 
    'summoning creative wonders', 'breathing life into ideas', 'building realms of fantasy', 
    'illuminating dreams', 'conjuring vibrant possibilities', 'crafting magical artifacts', 
    'organizing realms of imagination', 'bringing stories to life', 'unleashing boundless creativity', 
    'weaving enchanted textures', 'sculpting magical forms', 'adding finishing touches of wonder', 
    'polishing mystical surfaces', 'casting final charms', 'arranging enchanted details', 
    'painting visions with light', 'curating worlds of imagination', 'framing mystical moments', 
    'setting up magical technologies', 'drawing curtains on creativity', 'reflecting magic through mirrors',
    'reimagining enchanted landscapes', 'installing wonders of light', 'selecting fabrics of fantasy',
    'upgrading magical tools', 'placing enchanted objects', 'creating floating wonders',
    'bringing screens to life', 'clearing pathways for magic', 'arranging mystical symbols', 
    'painting with enchanted strokes', 'opening windows to new worlds', 'decorating with creative light',
    'adding touches of nature', 'staging creative atmospheres', 'building with mystical tools',
    'installing artifacts of wonder', 'organizing spaces of creation', 'decorating realms of fantasy', 
    'designing boundless realities', 'setting up creative sanctuaries', 'choosing pathways of imagination',
    'placing objects of wonder', 'organizing tools of creation', 'setting up fantastical systems',
    'arranging outdoor enchanted realms'
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

/* Modify the event listener for the reroll button
const rerollButton = document.getElementById("rerollButton");
rerollButton.addEventListener("click", rerollImages);

    // Function to show the overlay
    function showOverlay() {
      const overlay = document.getElementById("overlay");
      overlay.style.display = "block";
    }
    
    
  */ 


    
    
    
    
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

    

//reverse
    
    
    




  /*compare
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
*/


 
    
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
   
    
    /* Function to open Photopea with the specified image
function openPhotopeaWithImage(imageUrl) {
    const photopeaUrl = `https://www.photopea.com#`;
    const photopeaConfig = {
        files: [imageUrl] 
    };
    const encodedConfig = encodeURIComponent(JSON.stringify(photopeaConfig));
    window.open(photopeaUrl + encodedConfig, '_blank');
}

 */   



    
    
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

// Añadir al inicio del archivo, junto con las otras clases
class ImageUpscaler {
    constructor(apiEndpoint = '/upscale') {
        this.apiEndpoint = apiEndpoint;
    }

    async upscaleImage(imageUrl, progressCallback = null) {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    image_url: imageUrl
                })
            });

            const data = await response.json();

            if (data.status === 'error') {
                throw new Error(data.error || 'Upscaling failed');
            }

            if (data.status === 'success' && data.upscaled_url) {
                return data.upscaled_url;
            }

            throw new Error('No valid upscaled image URL in response');
        } catch (error) {
            console.error('Upscaling error:', error);
            throw error;
        }
    }
}

// Displays modal with generated images and associated action buttons
function showModal(imageUrls, transformedPrompt) {
    const modal = document.getElementById("modal");
    const closeButton = modal.querySelector(".close");

    closeButton.removeEventListener("click", closeModalHandler);
    closeButton.addEventListener("click", closeModalHandler);
    
    const thumbnailImage = document.getElementById("img2imgThumbnail");
    const userImageBase64 = thumbnailImage ? thumbnailImage.src : "";

    const imageGrid = document.getElementById("imageGrid");

    // No vaciar imageGrid, simplemente añadir nuevas imágenes

    function createButton(text, onClickHandler) {
        const button = document.createElement("button");
        button.textContent = text;
        button.type = "button";  // Asegurar type="button"
        button.addEventListener("click", onClickHandler);
        return button;
    }

    // Crear o buscar la estructura del carrusel
    let carouselWrapper = document.querySelector(".carousel-wrapper");

    // Si no existe el contenedor del carrusel, crearlo
    if (!carouselWrapper) {
        carouselWrapper = document.createElement("div");
        carouselWrapper.classList.add("carousel-wrapper");
        imageGrid.appendChild(carouselWrapper);
    }
    // Eliminar la card de "+ Add More" si existe para que siempre esté al final
    let addImageCard = document.querySelector(".add-image-card");
    if (addImageCard) {
        addImageCard.remove();
    }

    // Añadir las nuevas imágenes generadas al final
imageUrls.forEach((imageUrl) => {
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("carousel-slide");

    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = "Generated Image";
    image.classList.add("thumbnail");
    
       // Añadir lazy loading
    image.loading = "lazy";
    
    
     // Añadir evento de clic para abrir la imagen en fullscreen
    image.addEventListener('click', () => {
        openFullscreen(imageUrl);
    });
    // Crear el enlace <a> para la descarga
const downloadLink = document.createElement('a');

downloadLink.href = imageUrl; // Usa la URL dinámica de la imagen para el enlace
downloadLink.download = imageUrl.split('/').pop(); // Nombre del archivo basado en la URL
downloadLink.target = "_blank"; // Asegura que siempre se abra en una nueva pestaña


// Añadir el icono en lugar del texto "Download"
downloadLink.innerHTML = '<span class="material-symbols-outlined">download</span>';
    
    // Añadir el botón de upscale
        const upscaleButton = document.createElement("button");
        upscaleButton.innerHTML = '<span class="material-symbols-outlined">high_quality</span>';
        upscaleButton.title = "Upscale Image";
        upscaleButton.classList.add('upscale-button'); // Añadir clase para estilos

        // Crear instancia del upscaler
        const upscaler = new ImageUpscaler();

       upscaleButton.addEventListener("click", async () => {
    if (upscaleButton.disabled) return;

    try {
        upscaleButton.disabled = true;
        const loader = createLoader(imageContainer);
        
        const upscaler = new ImageUpscaler();
        const upscaledUrl = await upscaler.upscaleImage(imageUrl);
        
        if (!upscaledUrl) {
            throw new Error('No upscaled URL received');
        }

        // Actualizar la imagen con la versión upscaled
        image.src = upscaledUrl;
        
        // Actualizar el enlace de descarga
        if (downloadLink) {
            downloadLink.href = upscaledUrl;
            downloadLink.download = upscaledUrl.split('/').pop();
        }
        
        showNotification("Image successfully upscaled!", "success");
    } catch (error) {
        console.error("Upscaling failed:", error);
        showNotification(error.message || "Failed to upscale image. Please try again.", "error");
    } finally {
        removeLoader(imageContainer);
        upscaleButton.disabled = false;
    }
});
    
    

// Añadir la funcionalidad de descarga al hacer clic en el enlace
downloadLink.addEventListener('click', (e) => {
    // Solo para navegadores que soportan la propiedad download
    if (!downloadLink.download) {
        e.preventDefault(); // Previene la navegación si el navegador no soporta la descarga
        const a = document.createElement('a');
        a.href = imageUrl; // Usa la URL dinámica de la imagen
        a.download = imageUrl.split('/').pop(); // Nombre del archivo basado en la URL
        a.target = "_blank"; // Abrir en una nueva pestaña
        a.click(); // Simular el clic para iniciar la descarga
    }
});

// Añadir la imagen y el enlace al contenedor
imageContainer.appendChild(downloadLink); // Añadir el enlace de descarga al contenedor


    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("image-buttons");
    
     

    // Botones de acción
    const downloadButton = createButton("Download", () => downloadImage(imageUrl));
    const copyButton = createButton("Copy URL", () => copyImageUrlToClipboard(imageUrl));
    
   // Crear botones con iconos en lugar de texto
const copyPromptButton = createButton();
copyPromptButton.innerHTML = `<span class="material-symbols-outlined">content_copy</span>`;
copyPromptButton.onclick = () => copyTextToClipboard(transformedPrompt);


    





    

    
    

    // Añadir los botones a su contenedor
    [copyPromptButton].forEach(button => buttonsContainer.appendChild(button));
    // Añadir los botones al contenedor en el orden deseado
        buttonsContainer.appendChild(downloadLink);
        buttonsContainer.appendChild(upscaleButton);


   
    function createImageElement(imageUrl) {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'image-container';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Generated Image';

    return imgContainer;
}
    
   
    // Función para enviar la URL de la imagen y recibir la URL de la imagen escalada
async function sendImageForUpscale(imageUrl) {
    try {
        // Llama al endpoint del backend
        const response = await fetch('/upscale', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image_url: imageUrl
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Aquí está la URL de la imagen escalada
            const upscaledImageUrl = data.upscaled_image_url;
            console.log("Upscaled Image URL:", upscaledImageUrl);

            // Ahora puedes actualizar el frontend para mostrar la imagen escalada
            document.getElementById('upscaledImage').src = upscaledImageUrl;

        } else {
            console.error("Error:", data.error);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

// Event listener para el botón que activa el upscale
document.getElementById('upscaleButton').addEventListener('click', function() {
    const imageUrl = document.getElementById('imageInputUrl').value;
    if (imageUrl) {
        sendImageForUpscale(imageUrl);
    } else {
        alert("Por favor, ingresa una URL válida");
    }
});

    

    // Crear el menú de filtros y añadir sliders
    const filterMenu = document.createElement("div");
    filterMenu.classList.add("filter-menu");
    filterMenu.style.display = "none"; // Oculto por defecto

    // Slider para el grano con label
    const grainSlider = createSlider("Grain", 0, 50, 0, applyFilters);
    const grainLabel = document.createElement("label");
    grainLabel.textContent = `Filmgrain: ${grainSlider.slider.value}`;
    grainLabel.setAttribute("for", grainSlider.slider.id);  // Asociar el label con el slider
    filterMenu.appendChild(grainLabel);
    filterMenu.appendChild(grainSlider.slider);

    // Slider para el contraste con label
    const contrastSlider = createSlider("Contrast", 100, 300, 100, applyFilters);
    const contrastLabel = document.createElement("label");
    contrastLabel.textContent = `Contrast: ${contrastSlider.slider.value}`;
    contrastLabel.setAttribute("for", contrastSlider.slider.id);
    filterMenu.appendChild(contrastLabel);
    filterMenu.appendChild(contrastSlider.slider);

    // Slider para el brillo con label
    const brightnessSlider = createSlider("Brightness", 50, 200, 100, applyFilters);
    const brightnessLabel = document.createElement("label");
    brightnessLabel.textContent = `Brightness: ${brightnessSlider.slider.value}`;
    brightnessLabel.setAttribute("for", brightnessSlider.slider.id);
    filterMenu.appendChild(brightnessLabel);
    filterMenu.appendChild(brightnessSlider.slider);

    //Slider para el tinte (hue rotation) con label
    const hueSlider = createSlider("Hue", 0, 360, 0, applyFilters);
    const hueLabel = document.createElement("label");
    hueLabel.textContent = `Hue: ${hueSlider.slider.value}`;
    hueLabel.setAttribute("for", hueSlider.slider.id);
    filterMenu.appendChild(hueLabel);
    filterMenu.appendChild(hueSlider.slider);
    
    // Slider para la saturación con label
const saturateSlider = createSlider("Saturate", 100, 300, 100, applyFilters);
const saturateLabel = document.createElement("label");
saturateLabel.textContent = `Saturate: ${saturateSlider.slider.value}`;
saturateLabel.setAttribute("for", saturateSlider.slider.id);
filterMenu.appendChild(saturateLabel);
filterMenu.appendChild(saturateSlider.slider);

// Slider para el sepia con label
const sepiaSlider = createSlider("Sepia", 0, 1, 0, applyFilters);
sepiaSlider.slider.step = 0.01; // Ajustar el paso del slider para valores pequeños
const sepiaLabel = document.createElement("label");
sepiaLabel.textContent = `Sepia: ${sepiaSlider.slider.value}`;
sepiaLabel.setAttribute("for", sepiaSlider.slider.id);
filterMenu.appendChild(sepiaLabel);
filterMenu.appendChild(sepiaSlider.slider);

// Slider para la escala de grises con label
const grayscaleSlider = createSlider("Grayscale", 0, 1, 0, applyFilters);
grayscaleSlider.slider.step = 0.01;
const grayscaleLabel = document.createElement("label");
grayscaleLabel.textContent = `Grayscale: ${grayscaleSlider.slider.value}`;
grayscaleLabel.setAttribute("for", grayscaleSlider.slider.id);
filterMenu.appendChild(grayscaleLabel);
filterMenu.appendChild(grayscaleSlider.slider);

//Slider para invertir colores con label
const invertSlider = createSlider("Invert", 0, 1, 0, applyFilters);
invertSlider.slider.step = 0.01;
const invertLabel = document.createElement("label");
invertLabel.textContent = `Invert: ${invertSlider.slider.value}`;
invertLabel.setAttribute("for", invertSlider.slider.id);
filterMenu.appendChild(invertLabel);
filterMenu.appendChild(invertSlider.slider);

// Slider para el desenfoque con label
const blurSlider = createSlider("Blur", 0, 10, 0, applyFilters);
blurSlider.slider.step = 0.1;
const blurLabel = document.createElement("label");
blurLabel.textContent = `Blur: ${blurSlider.slider.value}`;
blurLabel.setAttribute("for", blurSlider.slider.id);
filterMenu.appendChild(blurLabel);
filterMenu.appendChild(blurSlider.slider);

//Slider para la opacidad con label
const opacitySlider = createSlider("Opacity", 0, 1, 1, applyFilters);
opacitySlider.slider.step = 0.01;
const opacityLabel = document.createElement("label");
opacityLabel.textContent = `Opacity: ${opacitySlider.slider.value}`;
opacityLabel.setAttribute("for", opacitySlider.slider.id);
filterMenu.appendChild(opacityLabel);
filterMenu.appendChild(opacitySlider.slider);


    // Añadir el menú de filtros debajo del botón "Filters"
    buttonsContainer.appendChild(filterMenu);

    // Función para alternar la visibilidad del menú de filtros
    function toggleFilterMenu() {
        filterMenu.style.display = filterMenu.style.display === "none" ? "block" : "none";
    }

   // Función para aplicar los filtros combinados
function applyFilters() {
    const grainAmount = parseInt(grainSlider.slider.value);
    const contrast = parseInt(contrastSlider.slider.value);
    const brightness = parseInt(brightnessSlider.slider.value);
    const hueRotation = parseInt(hueSlider.slider.value);
    const saturation = parseInt(saturateSlider.slider.value);
    const sepia = parseFloat(sepiaSlider.slider.value);
    const grayscale = parseFloat(grayscaleSlider.slider.value);
    const invert = parseFloat(invertSlider.slider.value);
    const blur = parseFloat(blurSlider.slider.value);
    const opacity = parseFloat(opacitySlider.slider.value);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = imageUrl;
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;

        // Aplicar los filtros combinados de CSS
        ctx.filter = `
            contrast(${contrast}%) 
            brightness(${brightness}%) 
            hue-rotate(${hueRotation}deg)
            saturate(${saturation}%) 
            sepia(${sepia}) 
            grayscale(${grayscale}) 
            invert(${invert}) 
            blur(${blur}px) 
            opacity(${opacity})
        `;
        
        ctx.drawImage(img, 0, 0);

        // Obtener los datos de la imagen para aplicar el grano
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Añadir grano a la imagen
        for (let i = 0; i < data.length; i += 4) {
            let grain = (Math.random() * 2 - 1) * grainAmount; // Pequeño grano para cada canal
            data[i] += grain;     // Rojo
            data[i+1] += grain;   // Verde
            data[i+2] += grain;   // Azul
        }

        ctx.putImageData(imageData, 0, 0);

        // Actualizar el src de la imagen con el canvas modificado
        image.src = canvas.toDataURL();
    };

    // Actualizar el valor de los labels en tiempo real
    grainLabel.textContent = `Filmgrain: ${grainSlider.slider.value}`;
    contrastLabel.textContent = `Contrast: ${contrastSlider.slider.value}`;
    brightnessLabel.textContent = `Brightness: ${brightnessSlider.slider.value}`;
   // hueLabel.textContent = `Hue: ${hueSlider.slider.value}`;
    saturateLabel.textContent = `Saturate: ${saturateSlider.slider.value}`;
    sepiaLabel.textContent = `Sepia: ${sepiaSlider.slider.value}`;
    grayscaleLabel.textContent = `Grayscale: ${grayscaleSlider.slider.value}`;
   // invertLabel.textContent = `Invert: ${invertSlider.slider.value}`;
    blurLabel.textContent = `Blur: ${blurSlider.slider.value}`;
   // opacityLabel.textContent = `Opacity: ${opacitySlider.slider.value}`;
}

    
    
    //ig
    
    
    function generateFilterGrid(buttonsContainer, imageUrl, mainImageElement) {
    const filDiv = document.createElement('div');
    filDiv.classList.add('fil');

    const igDiv = document.createElement('div');
    igDiv.classList.add('ig');

    // Inicialmente ocultar las miniaturas
    igDiv.style.display = 'none';

    const filters = [
        '1977', 'aden', 'brannan', 'brooklyn', 'clarendon', 'earlybird', 
        'gingham', 'hudson', 'inkwell', 'kelvin', 'lofi', 'moon'
    ];

    // Usa la imagen estática predeterminada (igram.png) para las miniaturas
    const staticImageUrl = 'static/img/adem-img/favicon.svg';  // Ruta correcta de la imagen igram.png

    filters.forEach((filter) => {
        const label = document.createElement('label');

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'filter';
        radio.value = filter;

        const img = document.createElement('img');
        img.alt = filter;

        // No cargar dinámicamente, usar la imagen estática predeterminada
        img.src = staticImageUrl;

        // Añadir el input y la imagen al label
        label.appendChild(radio);
        label.appendChild(img);

        // Añadir el label al contenedor de miniaturas
        igDiv.appendChild(label);

        // Evento 'change' para aplicar el filtro al cambiar de opción
        radio.addEventListener('change', (event) => {
            applyFilterToMainImage(event.target.value, imageUrl, mainImageElement);
        });
    });

    // Añadir botón para limpiar el filtro
    const clearFilterLabel = document.createElement('label');
    const clearButton = document.createElement('button');
    clearButton.textContent = '✕';
    clearButton.type = 'button';  // Asegurar que el botón es de tipo button

    // Evento para limpiar el filtro y restablecer la imagen original
    clearButton.addEventListener('click', () => {
        mainImageElement.src = imageUrl;  // Restablecer la imagen a su estado original sin filtros
    });

    // Añadir el botón de limpiar al contenedor
    clearFilterLabel.appendChild(clearButton);
    igDiv.appendChild(clearFilterLabel);

    // Añadir las miniaturas y el botón Clear al contenedor principal 'fil'
    filDiv.appendChild(igDiv);

    // Crear el botón de "Show/Hide"
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Filters';
    toggleButton.type = 'button';
    
    // Evento para hacer toggle del contenedor 'ig'
    toggleButton.addEventListener('click', () => {
        if (igDiv.style.display === 'none') {
            igDiv.style.display = 'flex';
            toggleButton.textContent = 'Close';
        } else {
            igDiv.style.display = 'none';
            toggleButton.textContent = 'Filters';
        }
    });

    // Añadir el botón de toggle al contenedor principal 'fil'
    filDiv.insertBefore(toggleButton, igDiv);

    // Añadir el contenedor de miniaturas al contenedor de botones
    buttonsContainer.appendChild(filDiv);
}
// Función para aplicar el filtro a la imagen principal
function applyFilterToMainImage(filterType, imageUrl, image) {
    if (!image) {
        console.error('Image is not defined or passed correctly');
        return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = imageUrl;
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;

        // Aplicar filtros según el tipo seleccionado
        switch (filterType) {
            case '1977':
                ctx.filter = 'sepia(0.5) contrast(1.1)';
                break;
            case 'aden':
                ctx.filter = 'contrast(0.9) saturate(0.85)';
                break;
            case 'brannan':
                ctx.filter = 'contrast(1.4) sepia(0.5)';
                break;
            case 'brooklyn':
                ctx.filter = 'contrast(0.9) brightness(1.1)';
                break;
            case 'clarendon':
                ctx.filter = 'contrast(1.2) saturate(1.35)';
                break;
            case 'earlybird':
                ctx.filter = 'sepia(0.4) saturate(1.6)';
                break;
            case 'gingham':
                ctx.filter = 'brightness(1.05) hue-rotate(340deg)';
                break;
            case 'hudson':
                ctx.filter = 'brightness(1.2) contrast(0.9)';
                break;
            case 'inkwell':
                ctx.filter = 'grayscale(1) contrast(1.2)';
                break;
            case 'kelvin':
                ctx.filter = 'brightness(1.5) contrast(1.2)';
                break;
            case 'lofi':
                ctx.filter = 'contrast(1.5) saturate(1.2)';
                break;
            case 'moon':
                ctx.filter = 'grayscale(1) contrast(1.1)';
                break;
            default:
                ctx.filter = 'none';
        }

        // Dibujar la imagen con el filtro aplicado en el canvas
        ctx.drawImage(img, 0, 0);

        // Actualizar el src de la imagen con el canvas modificado
        image.src = canvas.toDataURL();
    };
}

    
    ///ig
    
    
    //combined 
    
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



                // Generar los botones de filtros de Instagram y personalizados cuando se carga la imagen
                const buttonsContainer = document.querySelector(".image-buttons"); // Ajusta el selector según tu código
                generateInstagramFilterGrid(buttonsContainer, e.target.result, thumbnailImage);
            };
            reader.readAsDataURL(file);
        }
    });

    // Función para aplicar filtros combinados (Instagram y personalizados)
    function applyCombinedFiltersToCanvas(instagramFilterType, imageUrl) {
        const grainAmount = parseInt(grainSlider.slider.value);
        const contrast = parseInt(contrastSlider.slider.value);
        const brightness = parseInt(brightnessSlider.slider.value);
        const hueRotation = parseInt(hueSlider.slider.value);
        const saturation = parseInt(saturateSlider.slider.value);
        const sepia = parseFloat(sepiaSlider.slider.value);
        const grayscale = parseFloat(grayscaleSlider.slider.value);
        const invert = parseFloat(invertSlider.slider.value);
        const blur = parseFloat(blurSlider.slider.value);
        const opacity = parseFloat(opacitySlider.slider.value);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const img = new Image();
        img.src = imageUrl;
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;

            // Aplicar los filtros de Instagram y los filtros personalizados juntos
            let instagramFilter = '';
            switch (instagramFilterType) {
                case '1977':
                    instagramFilter = 'sepia(0.5) contrast(1.1)';
                    break;
                case 'aden':
                    instagramFilter = 'contrast(0.9) saturate(0.85)';
                    break;
                case 'brannan':
                    instagramFilter = 'contrast(1.4) sepia(0.5)';
                    break;
                case 'brooklyn':
                    instagramFilter = 'contrast(0.9) brightness(1.1)';
                    break;
                case 'clarendon':
                    instagramFilter = 'contrast(1.2) saturate(1.35)';
                    break;
                case 'earlybird':
                    instagramFilter = 'sepia(0.4) saturate(1.6)';
                    break;
                case 'gingham':
                    instagramFilter = 'brightness(1.05) hue-rotate(340deg)';
                    break;
                case 'hudson':
                    instagramFilter = 'brightness(1.2) contrast(0.9)';
                    break;
                case 'inkwell':
                    instagramFilter = 'grayscale(1) contrast(1.2)';
                    break;
                case 'kelvin':
                    instagramFilter = 'brightness(1.5) contrast(1.2)';
                    break;
                case 'lofi':
                    instagramFilter = 'contrast(1.5) saturate(1.2)';
                    break;
                case 'moon':
                    instagramFilter = 'grayscale(1) contrast(1.1)';
                    break;
                default:
                    instagramFilter = 'none';
            }

            // Aplicar todos los filtros al canvas
            ctx.filter = `
                contrast(${contrast}%) 
                brightness(${brightness}%) 
                hue-rotate(${hueRotation}deg)
                saturate(${saturation}%) 
                sepia(${sepia}) 
                grayscale(${grayscale}) 
                invert(${invert}) 
                blur(${blur}px) 
                opacity(${opacity}) 
                ${instagramFilter}
            `;
            
            ctx.drawImage(img, 0, 0);

            // Obtener los datos de la imagen para aplicar el grano
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Añadir grano a la imagen
            for (let i = 0; i < data.length; i += 4) {
                let grain = (Math.random() * 2 - 1) * grainAmount; // Pequeño grano para cada canal
                data[i] += grain;     // Rojo
                data[i+1] += grain;   // Verde
                data[i+2] += grain;   // Azul
            }

            ctx.putImageData(imageData, 0, 0);

            // Actualizar la imagen con los filtros aplicados
            thumbnailImage.src = canvas.toDataURL();

            // Crear un enlace de descarga
            const downloadLink = document.createElement("a");
            downloadLink.href = canvas.toDataURL("image/png"); // Convertir canvas a URL de imagen
            downloadLink.download = `filtered_image_combined.png`; // Nombre del archivo a descargar
            downloadLink.textContent = "Download Image with Combined Filters";

            // Añadir el enlace de descarga al contenedor de botones
            const buttonsContainer = document.querySelector(".image-buttons");
            buttonsContainer.innerHTML = ''; // Limpiar botones anteriores
            buttonsContainer.appendChild(downloadLink);
        };
    }

    // Generar el grid de filtros de Instagram
    function generateInstagramFilterGrid(buttonsContainer, imageUrl, mainImageElement) {
        const filters = [
            '1977', 'aden', 'brannan', 'brooklyn', 'clarendon', 'earlybird', 
            'gingham', 'hudson', 'inkwell', 'kelvin', 'lofi', 'moon'
        ];

        filters.forEach((filter) => {
            const button = document.createElement("button");
            button.textContent = filter;
            button.addEventListener("click", function() {
                // Aplicar el filtro combinado (Instagram y personalizado)
                applyCombinedFiltersToCanvas(filter, imageUrl);
            });

            // Añadir el botón de filtro al contenedor de botones
            buttonsContainer.appendChild(button);
        });
    }
});

    
    // Generar el grid de filtros dinámicamente usando 'generateFilterGrid'
    generateFilterGrid(buttonsContainer, imageUrl, image);
 // Añadir evento de clic para abrir la imagen en fullscreen
    image.addEventListener('click', () => {
        openFullscreen(imageUrl);
    });


    // Añadir la imagen y los botones al contenedor de la imagen
    imageContainer.appendChild(image);
    imageContainer.appendChild(buttonsContainer);
    carouselWrapper.appendChild(imageContainer);
    imageGrid.appendChild(imageContainer);
});

    

    
    
    
    // Siempre añadir la card para añadir más imágenes al final
    addImageCard = document.createElement("div");
    addImageCard.classList.add("carousel-slide", "add-image-card");

    const addImageButton = document.createElement("button");
    addImageButton.textContent = "+ Add More";
    addImageButton.classList.add("add-more-button");
    addImageButton.addEventListener("click", () => {
        console.log("Add more images triggered.");
    });

    addImageCard.appendChild(addImageButton);
    carouselWrapper.appendChild(addImageCard); // Siempre al final

    // Crear botones prev y next para controlar el carrusel si no existen
    if (!document.querySelector(".prev")) {
        const prevButton = document.createElement("button");
        prevButton.type = "button";
        prevButton.classList.add("prev");
        prevButton.innerHTML = "&#10094;";
        prevButton.addEventListener("click", () => moveSlide(-1));
        imageGrid.appendChild(prevButton);
    }

    if (!document.querySelector(".next")) {
        const nextButton = document.createElement("button");
        nextButton.type = "button";
        nextButton.classList.add("next");
        nextButton.innerHTML = "&#10095;";
        nextButton.addEventListener("click", () => moveSlide(1));
        imageGrid.appendChild(nextButton);
    }

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

        // Deshabilitar o esconder el botón "prev" cuando estemos en la primera diapositiva
        const prevButton = document.querySelector('.prev');
        if (currentIndex === 0) {
            prevButton.disabled = true;
            prevButton.style.display = 'none';
        } else {
            prevButton.disabled = false;
            prevButton.style.display = 'block';
        }
    }
    
        
    // Función para abrir la imagen en fullscreen
function openFullscreen(imageUrl) {
    fullscreenImage.src = imageUrl;
    fullscreenContainer.style.display = 'block'; // Mostrar el contenedor fullscreen

    // Limpiar el contenido del sidebar y añadir los botones de control correspondientes
   // Limpiar el sidebar sidebarContent.innerHTML = ''; 
    
}

// Cerrar el fullscreen cuando se hace clic en el botón de cerrar
closeFullscreen.addEventListener('click', () => {
    fullscreenContainer.style.display = 'none'; // Ocultar el contenedor fullscreen
});
    
}
    

// En la función showModal, actualiza el loader para mostrar progreso:
function createLoader(container) {
    const loader = document.createElement("div");
    loader.classList.add("loader");
    loader.innerHTML = `
        <div class="spinner"></div>
        <p class="loader-text">Upscaling image... This may take a few moments.</p>
        <div class="loader-progress">Please wait while we process your image</div>
    `;
    container.appendChild(loader);
    return loader;
}

// Actualizar el estilo del loader para mostrar mejor el progreso
const styles = `
.loader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    z-index: 1000;
}

.loader-text {
    margin: 10px 0;
    font-size: 16px;
}

.loader-progress {
    font-size: 14px;
    color: #aaa;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

// Agregar los estilos al documento
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

function removeLoader(container) {
    const loader = container.querySelector(".loader");
    if (loader) {
        loader.remove();
    }
}

function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.classList.add("notification", type);
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
} 
    
// Función auxiliar para crear un slider con etiqueta de valor
function createSlider(label, min, max, defaultValue, onChange) {
    const container = document.createElement("div");
    const labelElement = document.createElement("label");
    labelElement.textContent = label;

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = min;
    slider.max = max;
    slider.value = defaultValue;
    
    const valueDisplay = document.createElement("span");
    valueDisplay.textContent = defaultValue;

    slider.addEventListener('input', function () {
        valueDisplay.textContent = slider.value;
        onChange(); // Aplicar el filtro al cambiar el valor
    });

    container.appendChild(labelElement);
    container.appendChild(slider);
    container.appendChild(valueDisplay);

    return {
        slider,
        valueDisplay
    };
}

// Añadir un listener global para errores no capturados
window.addEventListener('error', function(event) {
    console.error("Error no capturado:", event.error);
});

    
    
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
  /* Add event listener to the "Clear All" button
  const clearAllButton = document.getElementById("clearAllButton");
  clearAllButton.addEventListener("click", clearAll);*/
    

    let useOpenAI = true; // Controla el estado del switch

function processPrompt(prompt) {
    if (useOpenAI) {
        return transformPromptWithOpenAI(prompt); // Usa OpenAI si está activado
    } else {
        return Promise.resolve(prompt); // Devuelve el prompt original si está desactivado
    }
}

    
 async function transformPromptWithOpenAI(prompt) {
    try {
        const response = await fetch("/openai/transform", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt, use_openai: true }) // Siempre envía el estado del switch
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.transformed_prompt || prompt; // Retorna el prompt transformado o el original
    } catch (error) {
        console.error("Error using OpenAI:", error);
        return prompt; // Si hay un error, retorna el prompt original
    }
}


    
    
    
});


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

// Función para añadir todos los botones a una imagen
function addImageButtons(imageContainer, imageUrl) {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'image-buttons';
    
    const upscaleButton = document.createElement('button');
    upscaleButton.className = 'gradient-animation';
    upscaleButton.innerHTML = '<span class="material-symbols-outlined">high_quality</span>';
    upscaleButton.title = 'Upscale Image';
    
    upscaleButton.onclick = async function() {
        try {
            // Mostrar estado de procesamiento
            upscaleButton.disabled = true;
            upscaleButton.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span>';
            
            const response = await fetch('/upscale', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image_url: imageUrl })
            });
            
            const data = await response.json();
            console.log('Respuesta del servidor:', data);
            
            if (data.status === 'success' && data.upscaled_url) {
                // Abrir la imagen en una nueva pestaña
                window.open(data.upscaled_url, '_blank');
            } else {
                throw new Error(data.error || 'Upscale failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error during upscale: ' + error.message);
        } finally {
            upscaleButton.disabled = false;
            upscaleButton.innerHTML = '<span class="material-symbols-outlined">high_quality</span>';
        }
    };
    
    buttonContainer.appendChild(upscaleButton);
    imageContainer.appendChild(buttonContainer);
}
