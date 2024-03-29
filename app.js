const express = require('express');
const cron = require('node-cron');
const puppeteer = require('puppeteer');
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

// Function to capture screenshot
async function captureScreenshot(page, url, outputPath) {
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })

        await page.setViewport({ width: 1280, height: 720 });

        await page.screenshot({ path: outputPath });

        console.log(`Screenshot captured successfully from ${url} and saved to ${outputPath}`);
    } catch (error) {
        console.error(`Error capturing screenshot from ${url}:`, error);
    }
}

// Function to update images
async function updateImages() {
    try {
        const browser = await puppeteer.launch({
            headless: true, // Modo headless
        });
        const page = await browser.newPage();

        // Read the file containing URLs
        const urlsAndNames = fs.readFileSync('./image_urls.txt', 'utf8').split('\n').filter(Boolean);

        // Fetch each image from the URLs
        for (const line of urlsAndNames) {
            const [url, imageName] = line.split('|');
            try {
                await captureScreenshot(page, url, `./images/${imageName}`);
                console.log(`Image ${imageName} captured successfully!`);
            } catch (error) {
                console.error(`Error capturing screenshot from ${url}:`, error);
            }
        }

        await browser.close();

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
