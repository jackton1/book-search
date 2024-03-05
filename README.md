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

![BookSphere Preview](https://private-user-images.githubusercontent.com/17484350/309938333-a810cab4-af7e-438a-92e0-f9fcc04dee4e.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDk2MTYyMzQsIm5iZiI6MTcwOTYxNTkzNCwicGF0aCI6Ii8xNzQ4NDM1MC8zMDk5MzgzMzMtYTgxMGNhYjQtYWY3ZS00MzhhLTkyZTAtZjlmY2MwNGRlZTRlLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAzMDUlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMzA1VDA1MTg1NFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTQxMmJiMDRhMDI0ZmVjYWQxYjMyNTliMDhiZDUxODY0OGIzOTkwY2E2MzRmMmRkNTViNmI1ZDRmNTk5NGY4ZTEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.zWKwG-U_Wv8izTvfeKig8zbbGzt58Yv7OW-53CPubYo)


## Getting Started

1. Clone this repository.
2. Create a `.env.backend` file by copying the `.env.backend.example` file 
3. Replace the `GOOGLE_BOOKS_API_KEY` with your own Google Books API key. You can obtain one from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
4. Generate a secret key and replace the `SECRET_KEY` with the generated key.
5. Install [Docker Desktop](https://www.docker.com/products/docker-desktop) if you haven't already.
6. Run `docker-compose up` to start the application.
7. Visit `http://localhost:3000` to access the application.
8. Enjoy searching for books!

