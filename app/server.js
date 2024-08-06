const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'html');

// Middleware to handle HTML rendering
const ejs = require('ejs');
app.engine('html', ejs.renderFile);

app.post('/upscale-image', async (req, res) => {
    const { imageUrl } = req.body;
    const apiKey = process.env.REPLICATE_API_TOKEN; // Asegúrate de configurar esta variable de entorno en Render
    const version = 'dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e';

    const input = {
        version: version,
        input: {
            image: imageUrl
        }
    };

    try {
        const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(input)
        });

        const data = await response.json();

        if (data.status === 'succeeded') {
            const upscaledImageUrl = data.output[0];
            res.render('upscale-image', { upscaled_image_url: upscaledImageUrl });
        } else {
            res.status(500).json({ error: 'Upscaling failed' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
