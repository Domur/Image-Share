# Image Share

### Purpose
This project allows users to upload images (.jpg or .png) to be accessible and sharable online at a user defined url.

### How it's done
When the user attaches an image file, the file is sent to the server where it is trimmed of any extraneous information that may make it not work correctly, then stored in a MonogDB database. When the user goes to domer.dev/i/&lt;custom url>, the server will fetch the image from the database and send it to the page.

### To do
* <del>Host on  GCP</del>
* <del>Implement mechanism for uploading to requested url</del>
* Create client application for uploading pics instead of using webpage