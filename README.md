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

![BookSphere Preview](https://github.com/jackton1/book-search/assets/17484350/f61aa45a-2903-4ea4-8cbb-803554514782)



## Getting Started

1. Clone this repository.
2. Create a `.env.backend` file by copying the `.env.backend.example` file.
3. Set the `GOOGLE_BOOKS_API_KEY` with your own Google Books API key. You can obtain one from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
4. Generate a secret key and set the `SECRET_KEY` with the generated key.
5. Create a `.env.frontend` file by copying the `.env.frontend.example` file.
6. Generate a secret key and set the `NEXTAUTH_SECRET` with the generated key.
7. Install [Docker Desktop](https://www.docker.com/products/docker-desktop) if you haven't already.
8. Run `docker-compose up` to start the application.
9. Visit `http://localhost:3000` to access the application.
10. Enjoy searching for books!

