# BookSphere

Welcome to BookSphere, your go-to book search application crafted with the power of [FASTAPI](https://fastapi.tiangolo.com/) and [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/).

## Description

BookSphere is a web application that allows users to search for books using keywords and displays detailed information about the searched books. The frontend is built with Next.js and Tailwind CSS, while the backend utilizes FastAPI to communicate with the Google Books API.

## Features

- Search for books using keywords
- Display book results with cover images, titles, authors, and descriptions
- Responsive design for usability on various screen sizes

## Technologies Used

- Frontend:
    - Next.js
    - Tailwind CSS

- Backend:
    - FastAPI

- External APIs:
    - Google Books API

## Preview

![BookSphere Preview](https://github-production-user-asset-6210df.s3.amazonaws.com/17484350/309993124-d05fa581-a09a-43f4-a834-7d6e30ae11b7.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20240305%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240305T052730Z&X-Amz-Expires=300&X-Amz-Signature=967743b59b01bcd89beb2ed8d70870441e8d1792e0b4c51500e6aa1664dc17d6&X-Amz-SignedHeaders=host&actor_id=17484350&key_id=0&repo_id=767223389)



## Getting Started

1. Clone this repository.
2. Create a `.env.backend` file by copying the `.env.backend.example` file 
3. Replace the `GOOGLE_BOOKS_API_KEY` with your own Google Books API key. You can obtain one from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
4. Generate a secret key and replace the `SECRET_KEY` with the generated key.
5. Install [Docker Desktop](https://www.docker.com/products/docker-desktop) if you haven't already.
6. Run `docker-compose up` to start the application.
7. Visit `http://localhost:3000` to access the application.
8. Enjoy searching for books!

