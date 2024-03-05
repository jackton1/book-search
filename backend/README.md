# books-search - (Backend)
Sample books application using [Google Books API](https://developers.google.com/books/docs/overview).


## Requirements

- [Python 3.11](https://www.python.org/downloads/)

Optionally use tools like [pyenv](https://github.com/pyenv/pyenv) to manage installing and switching between different versions of Python. See the [Installation section](https://github.com/pyenv/pyenv#installation) for more details.


## Installation
Install the required packages using pipenv.

Run:

```bash
pip install pipenv
pipenv install
```

> [!NOTE]
> 
> * You'll need to have Python 3.11 installed to run the above command. See the [Requirements](#requirements) section for more details.

## Running the application locally

Run the following command to start the application:

```bash
pipenv run uvicorn main:app --reload
```

The application will start at `http://localhost:8000`.

Open your browser and navigate to `http://localhost:8000/docs` to view the API documentation.
