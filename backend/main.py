from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from book import database, models
from book.routers import authentication, user, book, health

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(authentication.router)
app.include_router(user.router)
app.include_router(book.router)
app.include_router(health.router)
