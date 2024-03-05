import { api, AuthToken, handleError, setAuthHeader } from "@/lib/api";

interface IndustryIdentifier {
  type: string;
  identifier: string;
}

interface ReadingModes {
  text: boolean;
  image: boolean;
}

interface PenalizationSummary {
  containsEpubBubbles: boolean;
  containsImageBubbles: boolean;
}

interface ImageLinks {
  smallThumbnail: string;
  thumbnail: string;
}

interface VolumeInfo {
  title: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  publishedDate: string;
  description?: string;
  industryIdentifiers: IndustryIdentifier[];
  readingModes: ReadingModes;
  pageCount: number;
  printType: string;
  categories: string[];
  maturityRating: string;
  allowAnonLogging: boolean;
  contentVersion: string;
  panelizationSummary: PenalizationSummary;
  imageLinks: ImageLinks;
  language: string;
  previewLink: string;
  infoLink: string;
  canonicalVolumeLink: string;
  averageRating?: number;
  ratingsCount?: number;
}

interface ListPrice {
  amount: number;
  currencyCode: string;
}

interface RetailPrice {
  amount: number;
  currencyCode: string;
}

interface ListPrice1 {
  amountInMicros: number;
  currencyCode: string;
}

interface RetailPrice1 {
  amountInMicros: number;
  currencyCode: string;
}

interface RentalDuration {
  unit: string;
  count: number;
}

interface Offer {
  finskyOfferType: number;
  listPrice: ListPrice1;
  retailPrice: RetailPrice1;
  giftable?: boolean;
  rentalDuration?: RentalDuration;
}

interface SaleInfo {
  country: string;
  saleability: string;
  isEbook: boolean;
  listPrice?: ListPrice;
  retailPrice?: RetailPrice;
  buyLink?: string;
  offers?: Offer[];
}

interface Epub {
  isAvailable: boolean;
  acsTokenLink?: string;
  downloadLink?: string;
}

interface Pdf {
  isAvailable: boolean;
  acsTokenLink?: string;
}

interface AccessInfo {
  country: string;
  viewability: string;
  embeddable: boolean;
  publicDomain: boolean;
  textToSpeechPermission: string;
  epub: Epub;
  pdf: Pdf;
  webReaderLink: string;
  accessViewStatus: string;
  quoteSharingAllowed: boolean;
}

interface SearchInfo {
  textSnippet: string;
}

export interface BookVolume {
  kind?: string; // Default values are not directly supported in TypeScript interfaces, consider initializing in class constructor if using classes.
  id?: string;
  etag?: string;
  selfLink?: string;
  volumeInfo?: VolumeInfo;
  saleInfo?: SaleInfo;
  accessInfo?: AccessInfo;
  searchInfo?: SearchInfo;
}

export interface BookSearchResponse {
  kind?: string;
  totalItems: number;
  items: BookVolume[];
}


interface BookSearchData extends AuthToken {
  q: string;
  page: string;
}

interface BookData extends AuthToken {
  id: string;
}

export async function searchBooks({ q, page, accessToken }: BookSearchData): Promise<BookSearchResponse> {
  const params = new URLSearchParams({ q, page });
  const response = await api.get(`/book/search?${params.toString()}`, setAuthHeader(accessToken));
  return handleError(response);
}


export async function get({ id, accessToken }: BookData): Promise<BookVolume> {
  const response = await api.get(`/book/${id}`, setAuthHeader(accessToken));
  return handleError(response);
}
