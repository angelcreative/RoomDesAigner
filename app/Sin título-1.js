    function getHarmonyColors(color, type) {
        const baseColor = chroma(color);
        const baseHue = baseColor.get('hsl.h');
        let colors;

        switch (type) {
            case 'complementary':
                colors = [baseColor.hex(), chroma.hsl((baseHue + 180) % 360, baseColor.get('hsl.s'), baseColor.get('hsl.l')).hex(), "#18222d", "#18222d"];
                break;
            case 'analogous':
                colors = [baseColor.hex(), chroma.hsl((baseHue + 30) % 360, baseColor.get('hsl.s'), baseColor.get('hsl.l')).hex(), chroma.hsl((baseHue - 30 + 360) % 360, baseColor.get('hsl.s'), baseColor.get('hsl.l')).hex(), "#18222d"];
                break;
            case 'triadic':
                colors = [baseColor.hex(), chroma.hsl((baseHue + 120) % 360, baseColor.get('hsl.s'), baseColor.get('hsl.l')).hex(), chroma.hsl((baseHue + 240) % 360, baseColor.get('hsl.s'), baseColor.get('hsl.l')).hex(), "#18222d"];
                break;
            case 'square':
                colors = [baseColor.hex(), chroma.hsl((baseHue + 90) % 360, baseColor.get('hsl.s'), baseColor.get('hsl.l')).hex(), chroma.hsl((baseHue + 180) % 360, baseColor.get('hsl.s'), baseColor.get('hsl.l')).hex(), chroma.hsl((baseHue + 270) % 360, baseColor.get('hsl.s'), baseColor.get('hsl.l')).hex()];
                break;
            default:
                colors = [baseColor.hex(), "#18222d", "#18222d", "#18222d"];
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
            color: "#f00"
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



====
    
    
     //color wheel
    
        // Initialize color wheel
            initializeColorWheel();
        function initializeColorWheel() {
            var colorWheelContainer = document.getElementById('colorWheelContainer');
            var colorWheel = new iro.ColorPicker(colorWheelContainer, {
                width: 200,
                color: "#007876"
            });

            function updateHarmonyColors(baseColor) {
                const harmonyType = document.getElementById('harmonyType').value;
                const colors = getHarmonyColors(baseColor, harmonyType);
                displayColors(colors);
                updateColorIndicators(colors);
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
                        hues = [baseHue, (baseHue + 30) % 360, (baseHue - 30 + 360) % 360];
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
                colors.forEach((color, index) => {
                    if (index === 0) return; // Skip the base color        
const hue = chroma(color).get('hsl.h');
                    const angleRadians = (hue * (Math.PI / 180)) - (Math.PI / 2); // Adjust angle to start from the top
                    const indicatorX = wheelRadius + wheelRadius * Math.cos(angleRadians);
                    const indicatorY = wheelRadius + wheelRadius * Math.sin(angleRadians);

                    const indicator = document.createElement('div');
                    indicator.classList.add('colorIndicator');
                    indicator.style.left = `${indicatorX}px`;
                    indicator.style.top = `${indicatorY}px`;
                    indicator.style.backgroundColor = color;

                    colorWheelContainer.appendChild(indicator);
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

            // Handle the "Use These Colors" button click
            document.getElementById('useColors').addEventListener('click', function() {
                alert('Implement what happens when "Use These Colors" is clicked.');
            });

            // Initialize the color wheel with the default color
            updateHarmonyColors(colorWheel.color.hexString);
        };
   
   