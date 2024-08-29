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

    
//wheel
   document.addEventListener('DOMContentLoaded', function() {
    // Definimos colorWheel fuera de cualquier función para asegurar su acceso global dentro de este script
    var colorWheelContainer = document.getElementById('colorWheelContainer');
    var colorWheel = new iro.ColorPicker(colorWheelContainer, {
        width: 200,
        color: "#f00"
    });

    function updateHarmonyColors(baseColor) {
        const harmonyType = document.getElementById('harmonyType').value;
        const colors = getHarmonyColors(baseColor, harmonyType);
        displayColors(colors);
        updateColorIndicators(colors);
        displayColorCards(colors);
    }

    function getHarmonyColors(color, type) {
        const baseColor = chroma(color);
        const baseHue = baseColor.get('hsl.h');
        const baseSaturation = baseColor.get('hsl.s');
        const baseLightness = baseColor.get('hsl.l');
        let hues;

        switch (type) {
            case 'complementary':
                hues = [baseHue, (baseHue + 180) % 360];
                break;
            case 'analogous':
                hues = [(baseHue - 30 + 360) % 360, baseHue, (baseHue + 30) % 360];
                break;
            case 'triadic':
                hues = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
                break;
            case 'square':
                hues = [baseHue, (baseHue + 90) % 360, (baseHue + 180) % 360, (baseHue + 270) % 360];
                break;
        }

        return hues.map(hue => chroma.hsl(hue, baseSaturation, baseLightness).hex());
    }

    function displayColors(colors) {
        const harmonyColors = document.getElementById('harmonyColors');
        harmonyColors.innerHTML = '';
        colors.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.style.backgroundColor = color;
            harmonyColors.appendChild(colorDiv);
        });
    }

    function updateColorIndicators(colors) {
        // Remove existing indicators
        colorWheelContainer.querySelectorAll('.colorIndicator').forEach(indicator => indicator.remove());

        // Add new indicators
        const wheelRadius = colorWheelContainer.offsetWidth / 2;
        const centerX = wheelRadius;
        const centerY = wheelRadius;

        colors.forEach((color, index) => {
            if (index === 0) return; // Skip the base color

            const hue = chroma(color).get('hsl.h');
            const angleRadians = (hue * Math.PI / 180); // Convert hue to radians
            const indicatorX = centerX + wheelRadius * Math.cos(angleRadians);
            const indicatorY = centerY - wheelRadius * Math.sin(angleRadians); // Note the subtraction here to correct the direction

            const indicator = document.createElement('div');
            indicator.classList.add('colorIndicator');
            indicator.style.position = 'absolute';
            indicator.style.left = `${indicatorX}px`;
            indicator.style.top = `${indicatorY}px`;
            indicator.style.transform = 'translate(-50%, -50%)'; // Center the indicator on the point
            indicator.style.backgroundColor = color;

            colorWheelContainer.appendChild(indicator);
        });
    }

    function displayColorCards(colors) {
        const colorCardsContainer = document.getElementById('colorCards');
        colorCardsContainer.innerHTML = ''; // Clear previous cards

        colors.forEach(color => {
            const rgbColor = chroma(color).rgb();
            const [r, g, b] = rgbColor;
            let colorName = ntc.name(color)[1]; // Get color name using ntc.js

            // Remove the "Color RGB" part from the color name
            colorName = colorName.replace(/ Color RGB.*/, '');

            // Get HEX and HSL values
            const hexColor = chroma(color).hex();
            const hslColor = chroma(color).hsl().map(value => value.toFixed(2));

            // Determine if text should be light or dark based on the color's luminance
            const textColor = chroma(color).luminance() > 0.5 ? '#000000' : '#ffffff';

            // Create a new card for each color
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('colorCard');
            cardDiv.style.backgroundColor = color;
            cardDiv.style.color = textColor; // Set the text color dynamically
            cardDiv.innerHTML = `
                <div style="background-color:${color};width:50px;height:50px;margin-bottom:5px;"></div>
                <p>${colorName}</p>
                <p>RGB: ${r} ${g} ${b}</p>
                <p>HEX: ${hexColor}</p>
                <p>HSL: ${hslColor[0]} ${hslColor[1]} ${hslColor[2]}</p>
            `;
            colorCardsContainer.appendChild(cardDiv);
        });
    }

    // Listen to color wheel changes
    colorWheel.on(['color:init', 'color:change'], function(color) {
        updateHarmonyColors(color.hexString);
    });

    // Update the harmony colors when the harmony type is changed
    document.getElementById('harmonyType').addEventListener('change', function() {
        updateHarmonyColors(colorWheel.color.hexString);
    });

    // Initialize the color wheel with the default color
    updateHarmonyColors(colorWheel.color.hexString);

    // Definimos la función getSelectedValues dentro del scope adecuado
    window.getSelectedValues = function() {
        const elementIds = [
            "person",
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
            "hairstyle_select"
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

        // Add the selected colors from the color wheel
        const selectedColors = colorWheel.colors.map(c => c.hexString);
        values['harmony_colors'] = selectedColors; // Add the selected colors to the values object

        return values;
    }
});

    
//end wehel    

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
    

    
 
function generateImages(imageUrl, selectedValues, isImg2Img) {
  showGeneratingImagesDialog();

  const apiKey = "X0qYOcbNktuRv1ri0A8VK1WagXs9vNjpEBLfO8SnRRQhN0iWym8pOrH1dOMw"; // Reemplaza con tu clave API real
  const customText = document.getElementById("customText").value;
  const pictureSelect = document.getElementById("imageDisplayUrl");
  const selectedPicture = pictureSelect.value;
    const promptInit = `Sharp focus, RAW, unedited, symmetrical balance, in-frame,  hyperrealistic, highly detailed,  stunningly beautiful, intricate, (professionally color graded), ((bright soft diffused light)), HDR, Unedited 8K photograph .` ;
    //detailed skin texture, detailed clothing, 8K hyperrealistic, full body, detailed clothing, highly detailed, cinematic lighting, stunningly beautiful, intricate, sharp focus, f/1. 8, 85mm, (centered image composition), (professionally color graded), ((bright soft diffused light)), volumetric fog, trending on instagram, trending on tumblr, HDR 4K, 8K
//beautiful bright eyes, highly detailed eyes, realistic skin, detailed clothing, ultra detailed skin texture,
//    "prompt": "ultra realistic close up portrait ((beautiful pale cyberpunk female with heavy black eyeliner)), blue eyes, shaved side haircut, hyper detail, cinematic lighting, magic neon, dark red city, Canon EOS R3, nikon, f/1.4, ISO 200, 1/160s, 8K, RAW, unedited, symmetrical balance, in-frame, 8K",
    //32K shot,  Kodak Ektar 100 filmgrain, rich details, clear shadows, and highlights

  let plainText = Object.entries(selectedValues)
    .filter(([key, value]) => value && key !== "imageUrl")
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");

let promptEndy = `dense furnishings and decorations.`;

if (extractedColors.length > 0) {
    const colorNames = extractedColors.map(color => color.name); // Accede solo al nombre de cada color
    const colorsString = colorNames.join(', '); // Convierte el array de nombres a una cadena
    promptEndy += ` Colors used: ${colorsString}.`;
}

// Ejemplo del uso final de promptEndy
console.log(promptEndy);

  
 

const aspectRatio = document.querySelector('input[name="aspectRatio"]:checked').value;

let width, height;

if (aspectRatio === "landscape") { // 3:2 aspect ratio
  width = 1024;
  height = 768;  
} else if (aspectRatio === "portrait") { // 2:3 aspect ratio
  height = 1024;
  width = 768
} else if (aspectRatio === "square") { // 1:1 aspect ratio
  width = 1024;
  height = 1024;
}

console.log(`Width: ${width}, Height: ${height}`);

  const seedSwitch = document.getElementById("seedSwitch");
  const seedEnabled = seedSwitch.checked;
  const seedValue = seedEnabled ? null : "19071975";

  const optionalText = document.getElementById("optionalTextCheckbox").checked ? generateOptionalText() : "";
  const fractalText = document.getElementById("fractalTextCheckbox").checked ? generateFractalText() : "";
  const blurredBackground = document.getElementById("blurredTextCheckbox").checked ? generateBlurredBackground() : "";    
  const promptText = `${promptInit} ${plainText} ${customText} ${fractalText} ${blurredBackground} ${promptEndy} ${optionalText}`;

// Determine the model_id based on the selection of the "person" field


// Get selected models from the form
const personValue = document.getElementById("personModel").value;
const furnitureValue = document.getElementById("furnitureModel").value;

// Determine if the person model or furniture model should be used
let modelId = "flux"; // Default to flux

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
  lora = "clothingadjustloraap,open-lingerie-lora,perfect-round-ass-olaz,perfect-full-round-breast,xl_more_enhancer,detail-tweaker-xl";
} else if (modelId === furnitureValue) {
  lora = "u5-interior-design,clothingadjustloraap,xl_more_enhancer,detail-tweaker-xl";
}  

// Now build the JSON object with the updated values
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
  //highres_fix: "yes"
};
    //xl_more_enhancer,
    //real-skin-lora
    //lora 
    //perfect-eyes-xl,hand-detail-xl,
//  lora_model:"clothingadjustloraap,add-details-lora,more_details,unreal-realism",

//,epicrealismhelper
//epicrealism-v4 almost perfect faces + open-lingerie-lora / perfect-round-ass-olaz
    //lob-realvisxl-v20 takes some time but good
    //cyberrealistic-41 almost perfect darked skin
    //realistic-stock-photo-v2 is slow
    //realistic-vision-v51  fast
    //sdxlceshi  FOR ONLY FURNITURE takes time but is hd
    // majicmix-realisticsafeten furniture, test
    //juggernautxl-v9-rundiffus good for close up
    //aria-v1 perfect lora
    //skin-hands-malefemale-fro
    //westmixappfactory curvy
    //u58hvdfu4q good lora, bit manga
    //add-more-details-lor furniture lora
    //clothingadjustloraap   lora
    //epicrealism-xl
    //clothingadjustloraap
 //architectureexterior
    //yqmaterailenhancer
    
    
if (isImg2Img && imageUrl) {
    prompt.init_image = imageUrl;

    // Get the strength value from the slider
    const strengthSlider = document.getElementById("strengthSlider");
    prompt.strength = parseFloat(strengthSlider.value); // Use the slider value instead of a fixed value
  }
    
   /*   const chipsSV = document.getElementById("chipsSV");
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
        }*/


      // Get the <span> element by its class name
     // var spanElement = document.querySelector(".chipSV");

      // Get the text content of the <span> element
    //  var text = spanElement.textContent;

      // Replace all underscore characters with non-breaking spaces
     // var modifiedText = text.replace(/_/g, "&nbsp;");

      // Update the text content of the <span> element
   //   spanElement.textContent = modifiedText;
// Fetch request to generate images

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

//FWR
 
    // Llamada a fetchWithRetry en generateImages
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
            // Intentamos recuperar el fetch_result si existe, para seguir chequeando el estado
            return response.json().then(data => {
                if (data.fetch_result) {
                    checkImageStatus(data.fetch_result, data.transformed_prompt);
                    throw new Error(`Image generation in progress. Checking status...`);
                } else {
                    // Si no hay fetch_result, lanzamos el error para que pueda ser manejado
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            }).catch(() => {
                throw new Error(`HTTP error! Status: ${response.status}`);
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
        showModal(imageUrls, data.transformed_prompt);  // Mostrar las imágenes
        hideGeneratingImagesDialog();  // Ocultar cualquier diálogo de carga
    } else if (data.status === "processing" && data.fetch_result) {
        checkImageStatus(data.fetch_result, data.transformed_prompt);  // Seguir revisando el estado si está en proceso
    } else {
        throw new Error('Image generation failed or unexpected status.');
    }
})
.catch(error => {
    if (!error.message.includes("Image generation in progress")) {
        showError(error);  // Mostrar errores si no es un caso de generación en progreso
    }
});

// Define la función checkImageStatus con mayor retraso y más reintentos
function checkImageStatus(fetchResultUrl, transformedPrompt, retries = 10, delay = 10000) {
    fetch(fetchResultUrl, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: transformedPrompt })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'processing') {
            if (retries > 0) {
                console.log(`Processing... retrying in ${delay / 1000} seconds. Retries left: ${retries}`);
                setTimeout(() => checkImageStatus(fetchResultUrl, transformedPrompt, retries - 1, delay * 2), delay);
            } else {
                throw new Error('Image generation is taking too long. Please try again later.');
            }
        } else if (data.status === "success" && data.output) {
            const imageUrls = data.output.map(url =>
                url.replace("https://d1okzptojspljx.cloudfront.net", "https://modelslab.com")
            );
            showModal(imageUrls, transformedPrompt);  // Mostrar las imágenes
            hideGeneratingImagesDialog();  // Ocultar cualquier diálogo de carga
        } else if (data.status === "failed") {
            throw new Error('Image generation failed.');
        } else {
            throw new Error('Unexpected status received from the server.');
        }
    })
    .catch(error => {
        console.error('Error checking image status:', error);
        showError(error);
    });
}



    
//end FWR


function showError(error) {
    console.error("Error generating images:", error);
    alert("Error: " + error.message); // Muestra el mensaje de error en una alerta
    hideOverlay(); // Oculta la superposición y el mensaje de carga
}

function displayImages(images) {
    // Function to display images or handle the successful completion of the task
    console.log('Displaying images:', images);
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
const clarityButton = createButton("Clarity Upscale", () => clarityUpscale(imageUrl));
        const compareButton = createButton("Compare", () => openComparisonWindow(userImageBase64, imageUrl));
        const searchSimilarImagesButton = createButton("Search Similar Images", () => searchImageOnRapidAPI(imageUrl));



[downloadButton, copyButton, editButton, copyPromptButton, clarityButton, compareButton, searchSimilarImagesButton].forEach(button => buttonsContainer.appendChild(button));
        
      

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

    
 function createButton(text, onClickHandler) {
    const button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", onClickHandler);
    return button;
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
    
 

    
    
function createButton(text, onClickHandler) {
    const button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", onClickHandler);
    return button;
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