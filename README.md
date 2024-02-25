# Image Sync API
The "Image Sync API" is a Node.js application designed to automate the process of capturing and updating images from specified URLs on a scheduled basis.
This project leverages technologies such as Puppeteer for webpage manipulation and screenshot capture, Express for serving images through an endpoint, and cron for scheduling tasks.
https://github.com/eduardocvaz/image-sync-api/tree/master
## Key Features
* **Automated Image Capture**: Utilizes Puppeteer to navigate to specified URLs and capture screenshots of web pages.
* **Scheduled Updates**: Allows users to define update schedules in the schedule_config.txt file using cron syntax.
* **Flexible Configuration**: URLs and corresponding image names are configured in the image_urls.txt file, providing flexibility in defining which images to capture and update.
* **Error Handling: Incorporates** error handling mechanisms to gracefully manage issues that may arise during the image update process.
* **RESTful API Endpoint**: Provides a RESTful API endpoint /images/:name for accessing the captured images.

## How It Works

1. **Configuration**: Users define the URLs and corresponding image names in the ```image_urls.txt``` file. Additionally, they specify the update schedules in the ```schedule_config.txt``` file using cron syntax.
2. **Scheduled Tasks**: The application reads the schedule configuration and sets up cron jobs to trigger image update tasks according to the defined schedules.
3. **Image Capture and Update**: At each scheduled interval, the application launches a Puppeteer instance, navigates to the specified URLs, captures screenshots, and saves them with the corresponding image names in the ```images``` directory.
4. **Server Setup**: An Express server is started to serve the captured images through the ```/images/:name``` endpoint.
5. **Error Handling**: The application includes error handling mechanisms to log and manage errors encountered during the image capture and update process, ensuring smooth operation even in the face of unexpected issues.


##Prerequisites
Before running this project, ensure you have Node.js installed on your machine.

##Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory in your terminal.
3.Install dependencies by running the command:
```
npm install
```
##Usage
1. Prepare a file named ```image_urls.txt``` containing URLs and corresponding image names in the following format:
```
https://example.com|image1.jpg
https://example.org|image2.jpg

```
2. Configure the schedule for image updates in the ```schedule_config.txt``` file. Each line should consist of a description and a cron schedule separated by a pipe ('|') character, for example:
```
Daily Update|0 0 * * *
Weekly Update|0 0 * * 0
```
3. Start the server by running:
```
node app.js
```
## Endpoints
### GET /images/:name
Retrieve images by specifying the image name as a parameter.
Example:
```
GET /images/image1.jpg
```
## License
This project is licensed under the MIT License - see the LICENSE file for details.
