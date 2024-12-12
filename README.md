# PixelsOptional

## [Front-End for this repo] (https://github.com/harryfornasier/PixelsOptional)

PixelsOptional is a platform for sharing images taken with retro cameras, including both film and early digital models. The project is live and accessible at [PixelsOptional](https://pixels-optional.vercel.app).

Feel free to make an account and post some photos, preferably from an older camera. Make sure to use a random password when you make your account!  

## Technologies

- **Backend**: Node.js
- **Packgages**: Multer, Sharp, Bcrypt, Knex, uuid, mysql2

## How does it work?

### General Folder Structure

``` arduino
├── controllers/ # Logic to handle requests and responses
├── icons/ # Static icons for the front end
├── routes/ # Endpoint definitions and route handlers
├── middlewares/ 
├── seeds/ # dummy data for the mysql database
├── images/ # Storage for all posted images
├── migrations/ # The Knex migrations to populate the mysql database
├── models/ # knex queries for mysql
├── index.js # Entry point for the application
└── package.json # Project dependencies and scripts
```
### Endpoint structure

``` arduino
├── posts #Endpoint for querying the posts | DELETE, POST, GET, PATCH
├── cameras #Endpoint for querying many-to-many table of cameras | POST, GET
├── comments #Endpoint for querying comment table | POST, GET, DELETE
├── (WIP) Competition #Endpoint for querying the many-to-many table of competitions | POST, GET
├── users #Endpoint for querying the user table | POST, GET, PATCH
```
### Authentication

The authentication is custom, using bcrypt to hash the passwords and jwt for the tokens. A custom authentication middleware is then used to check if the user is logged in.

### Hosting

This API is hosted on my own hardware, a thinkstation TS440 running Ubuntu 22. I've used NGINX as the reverse proxy and everything is encrypted using cloudflare's certificates.

### The images

The images are sent using FormData to a /posts endpoint with express. The middleware Multer is used to parse the multipart/form-data stream to file. I created a Multer configuration that limits the filesize to 5mb and used regex to limit the filetypes to ones supported by Sharp.

I used the npm package Sharp to rotate the images and compress them with standard jpeg compression. Once compressed sharp writes the file to an images folder, with a unique uuid file name. This file name is added as a field within the corresponding 'post' table. 

The images folder is using 'express.static' to server the files for the front-end.

## Next steps

- **BMP Support**: Since this website is for users of older cameras I'd like to find a way to support the conversion of BMP images on the backend. Sharp does not support this file type.
- **Competitions**: I want to add competitions that users can take part in. Each month there will be some themes that you can take pictures around, the user with the most likes at the end of the month will the winner. I plan to use node-cron to schedule daily checks to see if the competition is over and then automatically crown a winner.
- **Users Route**: The users route should be split into Controllers and Models. It is currently in one file.

## Known Issues
- **Image Upload inconsistencies**: Occasionally when uploading an image it will fail, only displaying a white screen. I have yet to replicate this issue, but it seems to happen more often on phones. It needs more testing.
- **Admin Delete on mobile safari**: The admin button to delete posts doesn't appear on the mobile version of safari.

