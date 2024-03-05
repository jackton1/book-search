# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Avoids writing .pyc files to disk (useful in a container environment)
ENV PYTHONDONTWRITEBYTECODE 1
# Setting unbuffered output to see logs in real-time
ENV PYTHONUNBUFFERED 1
# Ensures that the virtual environment created by Pipenv is within the project directory
ENV PIPENV_VENV_IN_PROJECT=1

WORKDIR /usr/src/app

# build dependencies for psycopg2
RUN apt-get update && \
    apt-get -y install \
        build-essential \
        libpq-dev

# Install pipenv
RUN pip install pipenv==2023.12.1

# Copying Pipfiles
COPY Pipfile Pipfile.lock /usr/src/app/

# Installing project dependencies via Pipenv inside the virtual environment
RUN pipenv install --deploy --ignore-pipfile

# Copying the application source code
COPY . /usr/src/app

# Exposing the port the app runs on
EXPOSE 8000

# Running the application using the Python executable inside the virtual environment
CMD ["pipenv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

