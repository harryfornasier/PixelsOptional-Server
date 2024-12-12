# PixelsOptional

## [Front-End for this repo] (https://github.com/harryfornasier/PixelsOptional)

PixelsOptional is a platform for sharing images taken with retro cameras, including both film and early digital models. The project is live and accessible at [PixelsOptional](https://pixels-optional.vercel.app).

Feel free to make an account and post some photos, preferably from an older camera. Make sure to use a random password when you make your account!  

## How does it work?

### Hosting

This API is hosted on my own hardware, a thinkstation TS440 running Ubuntu 22. I've used NGINX as the reverse proxy and everything is encrypted using cloudflare's certificates.

### The images

The images are sent using FormData to a /posts endpoint with express. The middleware Multer is used to parse the multipart/form-data stream to file. I created a Multer configuration that limits the filesize to 5mb and used regex to limit the filetypes to ones supported by Sharp.

I used the npm package Sharp to rotate the images and compress them with standard jpeg compression. Once compressed sharp moves the file to a images folder, with a unique uuid file name. This file name is added as a field within the corresponding 'post' table. 

The images folder is using 'express.static' to server the files for the front-end

## Technologies

- **Frontend**: JavaScript, SCSS, Vite.js.
- **Hosting**: Vercel.

## Things I'd Like to Add

Future ideas for improving PixelsOptional:
- **Categories**: Allow users to filter photos by different categories for easier browsing.
- **Monthly Competitions**: Introduce a feature where users can participate in monthly challenges by taking photos of the same theme. The photo with the most likes at the end of the month wins.

## Unimplemented Features

Some features are not yet implemented:
- **Delete Own Posts**: You can't delete your own posts.
- **Delete Account**: You can't delete your account.
