const express = require('express');
const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');

const app = express();

// Endpoint to serve images
app.get('/images/:name', (req, res) => {
    const { name } = req.params;
    const path = `./images/${name}`;
    fs.readFile(path, (err, data) => {
        if (err) {
            res.status(404).send('Image not found');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.end(data);
    });
});

// Function to update images
async function updateImages() {
    try {
        // Read the file containing URLs
        const urlsAndNames = fs.readFileSync('./image_urls.txt', 'utf8').split('\n').filter(Boolean);

        // Fetch each image from the URLs
        const imagesPromises = urlsAndNames.map(async (line, index) => {
            const [url, imageName] = line.split('|');
            try {
                const response = await axios.get(url, { responseType: 'arraybuffer' });
                fs.writeFileSync(`./images/${imageName}`, response.data);
                console.log(`Image ${imageName} saved successfully!`);
            } catch (error) {
                console.error(`Error fetching image from ${url}:`, error);
            }
        });

        await Promise.all(imagesPromises);

        console.log('Images updated successfully!');
    } catch (error) {
        console.error('Error updating images:', error);
    }
}

// Read schedule configuration from file
const scheduleConfigLines = fs.readFileSync('./schedule_config.txt', 'utf8').split('\n');

// Extract non-comment lines
const nonCommentLines = scheduleConfigLines.filter(line => !line.startsWith('#') && line.trim() !== '');

// Parse and schedule tasks
nonCommentLines.forEach(config => {
    const [description, schedule] = config.split('|');
    cron.schedule(schedule, async () => {
        console.log(`Updating images (${description})...`);
        try {
            // Call the function to update images
            await updateImages();
            console.log(`Images updated successfully (${description})!`);
        } catch (error) {
            console.error(`Error updating images (${description}):`, error);
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
