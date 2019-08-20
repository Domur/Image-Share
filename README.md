# Image Share

### Purpose
This project allows users to upload images (.jpg or .png) to be accessible and sharable online (soon, localhost at the moment) at a user defined url.

### How it's done
When the user attaches an image file, the file is sent to the server where it is trimmed of any extraneous information that may make it not work correctly, then stored in a MonogDB database. When the user goes to localhost:3000/i/<custom url>, the server will fetch the image from the database and send it to the page.

### To do
* Implement mechanism for uploading to requested url
* Host on GCP or AWS so images can be accessible everywhere isntead of locally.