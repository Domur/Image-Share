# Image Share

### Purpose
This project allows users to upload images (.jpg or .png) to be accessible and sharable online at a user defined path.

### How it's done
When the user attaches an image file, the file is sent to the server where it is trimmed of any extraneous information that may make it not work correctly, then stored in a MonogDB database. When the user goes to domer.dev/i/&lt;custom path>, the server will fetch the image from the database and send it to the page.

### Demo
Try it out at https://domer.dev/i/

### To do list
* <del>Host on  GCP</del>
* <del>Implement mechanism for uploading to requested url</del>
* Create client application for uploading pics instead of using webpage

### Installation
* Clone this repo
* Navigate to this folder
* Create a .env file and add MONGO_URL=<""MongoDB cluster String"> (Create cluster if needed)
* Enter "npm start" or "node imageshare.js"
* Navigate to http://localhost:8080/i/