from typing import List, Optional

from pydantic import BaseModel


class IndustryIdentifier(BaseModel):
    type: str
    identifier: str


class ReadingModes(BaseModel):
    text: bool
    image: bool


class PanelizationSummary(BaseModel):
    containsEpubBubbles: bool
    containsImageBubbles: bool


class ImageLinks(BaseModel):
    smallThumbnail: str
    thumbnail: str


class VolumeInfo(BaseModel):
    title: str = ""
    subtitle: Optional[str] = None
    authors: Optional[List[str]] = None
    publisher: Optional[str] = None
    publishedDate: str = ""
    description: Optional[str] = None
    industryIdentifiers: Optional[List[IndustryIdentifier]] = None
    readingModes: ReadingModes
    pageCount: int = 0
    printType: str = ""
    categories: Optional[List[str]] = None
    maturityRating: str = ""
    allowAnonLogging: bool = False
    contentVersion: str = ""
    panelizationSummary: Optional[PanelizationSummary] = None
    imageLinks: Optional[ImageLinks] = None
    language: str = ""
    previewLink: str = ""
    infoLink: str = ""
    canonicalVolumeLink: str = ""
    averageRating: Optional[float] = None
    ratingsCount: Optional[int] = None


class ListPrice(BaseModel):
    amount: float
    currencyCode: str


class RetailPrice(BaseModel):
    amount: float
    currencyCode: str


class ListPrice1(BaseModel):
    amountInMicros: int
    currencyCode: str


class RetailPrice1(BaseModel):
    amountInMicros: int
    currencyCode: str


class RentalDuration(BaseModel):
    unit: str
    count: int


class Offer(BaseModel):
    finskyOfferType: int
    listPrice: ListPrice1
    retailPrice: RetailPrice1
    giftable: Optional[bool] = None
    rentalDuration: Optional[RentalDuration] = None


class SaleInfo(BaseModel):
    country: str
    saleability: str
    isEbook: bool
    listPrice: Optional[ListPrice] = None
    retailPrice: Optional[RetailPrice] = None
    buyLink: Optional[str] = None
    offers: Optional[List[Offer]] = None


class Epub(BaseModel):
    isAvailable: bool
    acsTokenLink: Optional[str] = None
    downloadLink: Optional[str] = None


class Pdf(BaseModel):
    isAvailable: bool
    acsTokenLink: Optional[str] = None


class AccessInfo(BaseModel):
    country: str
    viewability: str
    embeddable: bool
    publicDomain: bool
    textToSpeechPermission: str
    epub: Epub
    pdf: Pdf
    webReaderLink: str
    accessViewStatus: str
    quoteSharingAllowed: bool


class SearchInfo(BaseModel):
    textSnippet: str


class BookVolume(BaseModel):
    kind: str = ""
    id: str = ""
    etag: str = ""
    selfLink: str = ""
    volumeInfo: Optional[VolumeInfo] = None
    saleInfo: Optional[SaleInfo] = None
    accessInfo: Optional[AccessInfo] = None
    searchInfo: Optional[SearchInfo] = None


class BookSearchResponse(BaseModel):
    kind: Optional[str] = None
    totalItems: Optional[int] = None
    items: Optional[List[BookVolume]] = None
