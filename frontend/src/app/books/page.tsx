"use client";
import { getBooks } from "@/actions/book";
import BookList from "@/components/book-list";
import NavigationBar from "@/components/navigation-bar";
import SubmitButton from "@/components/submit-button";
import { BookVolume } from "@/lib/book";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";

const initialState = {
    success: false,
    message: '',
    redirectTo: '',
    data: undefined,
}

export default function Books() {
    const [search, setSearch] = useState('');
    const [state, formAction] = useFormState(getBooks, initialState);
    const [page, setPage] = useState(0);
    const [totalBooks, setTotalBooks] = useState(0);
    const [books, setData] = useState<BookVolume[]>([]);
    const [fetchingMore, setFetchingMore] = useState(false);

    useEffect(() => {
        if (state.success) {
            if (state.data) {
                if (fetchingMore) {
                    setData([...books, ...state.data.items]);
                } else {
                    setData(state.data.items);
                    setPage(0);
                    if (!state.data.items.length) {
                        toast.error('No books found.', { icon: '🚨' });
                    }
                    setTotalBooks(state.data.totalItems);
                }
            } else {
                setData([]);
                setTotalBooks(0);
            }
        } else if (state.message) {
            toast.error(state.message, { icon: '🚨' });
             if (state.redirectTo) {
                return redirect(state.redirectTo);
            }
        }
    }, [state]);

    return (
        <>
            <NavigationBar />
            <div className="flex flex-col items-center justify-center w-full bg-gray-100" style={{ minHeight: 'calc(100vh - 64px)' }}>
                <form
                  className="w-2/5 m-5"
                  action={() => {
                    if (!search) {
                      return;
                    }
                    const formData = new FormData();
                    formData.append('search', search);
                    formData.append('page', page.toString());
                    setFetchingMore(false);
                    formAction(formData);
                  }}
                >
                    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                 fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input
                          type="search"
                          id="search"
                          name="search"
                          value={search}
                          onChange={(e) => {
                            setSearch(e.target.value);
                            setFetchingMore(false);
                            setPage(0);
                          }}
                          className="block p-4 ps-10 w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 shadow-lg"
                          placeholder="Search for books and authors..."
                          required
                        />
                        <SubmitButton
                          text="Search"
                          loadingText="Searching..."
                          className="text-white absolute end-2.5 bottom-2.5 bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 h-2/3"
                        />
                    </div>
                </form>
                {books.length > 0 && (
                  <>
                      <BookList books={books} />
                      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                          <div>
                              <p className="text-sm text-gray-700">
                                  Showing <span className="font-medium">1</span> to <span className="font-medium">{books.length}</span> of{' '}
                                  <span className="font-medium">{totalBooks}</span> results
                              </p>
                          </div>
                      </div>
                      <div className="m-10 flex justify-center">
                          <form
                            action={() => {
                                if (!search) {
                                    return;
                                }
                                const formData = new FormData();
                                formData.append('search', search);
                                const newPage = page + 1;
                                formData.append('page', newPage.toString());
                                setPage(newPage);
                                setFetchingMore(true);
                                formAction(formData);
                            }}
                          >
                              <SubmitButton
                                text="View more Books"
                                loadingText="Loading..."
                                className="relative inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 pl-4 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:pointer-events-none disabled:opacity-40 "
                              />
                          </form>
                      </div>
                  </>
                )}
            </div>
        </>
    );
}
