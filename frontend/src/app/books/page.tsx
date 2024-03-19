"use client";
import { getBooks } from "@/actions/book";
import BookList from "@/components/book-list";
import NavigationBar from "@/components/navigation-bar";
import SubmitButton from "@/components/submit-button";
import { BookVolume } from "@/lib/book";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";

const initialState = {
  success: false,
  message: "",
  redirectTo: "",
  data: undefined,
};

export default function Books() {
  const [search, setSearch] = useState("");
  const [state, formAction] = useFormState(getBooks, initialState);
  const [page, setPage] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [books, setData] = useState<BookVolume[]>([]);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (state.success) {
      if (state.data) {
        if (fetchingMore) {
          setData([...books, ...state.data.items]);
        } else {
          setData(state.data.items);
          setPage(0);
          if (!state.data.items.length) {
            toast.error("No books found.", { icon: "🚨" });
          }
          setTotalBooks(state.data.totalItems);
        }
      } else {
        setData([]);
        setTotalBooks(0);
      }
    } else if (state.message) {
      toast.error(state.message, {
        icon: "🚨",
        duration: Infinity,
        position: "bottom-center"
      });
      if (state.redirectTo) {
        return redirect(state.redirectTo);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const searchFormAction = () => {
    if (!search) {
      return;
    }
    setSearching(true);
    setPage(0);
    setData([]);
    setFetchingMore(false);
    const formData = new FormData();
    formData.append("search", search);
    formData.append("page", page.toString());
    formAction(formData);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(0);
    setFetchingMore(false);
  };

  const viewMoreBooksFormAction = () => {
    if (!search) {
      return;
    }
    const formData = new FormData();
    formData.append("search", search);
    const newPage = page + 1;
    formData.append("page", newPage.toString());
    setPage(newPage);
    setFetchingMore(true);
    formAction(formData);
  };

  const handleClearSearch = () => {
    setSearching(false);
    setSearch("");
    setPage(0);
    setFetchingMore(false);
    setData([]);
    setTotalBooks(0);
  };

  return (
    <>
      <NavigationBar/>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center w-full bg-gray-100"
          style={{ minHeight: "calc(100vh - 94px)" }}
        >
          <div className="text-center p-5">
            <motion.h2
              className="text-3xl font-bold text-gray-800 mb-4"
              key={searching ? "searchResults" : "welcomeMessage"}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              {searching ? "Here are your search results:" : "Welcome to BookSphere! 📚"}
            </motion.h2>
            {!searching && (
              <motion.p
                className="text-gray-600"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                Search for books or authors to get started.
              </motion.p>
            )}
            <motion.p
              className="text-gray-500 text-xs mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              Data provided by{" "}
              <a
                href="https://developers.google.com/books/docs/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-500"
              >
                Google Books API
              </a>
            </motion.p>
          </div>
          <motion.form
            className="m-5 w-3/4 md:w-4/5 lg:w-3/5 xl:w-1/2"
            action={searchFormAction}
            initial={{ scale: 0.3 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          >
            <label htmlFor="search"
                   className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" aria-hidden="true"
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input
                type="search"
                id="search"
                name="search"
                value={search}
                onChange={handleSearch}
                className="block p-4 ps-10 w-full text-md text-gray-900 border border-gray-300 rounded-2xl bg-white focus:ring-0 focus:ring-offset-0 focus:bg-gray-50 shadow-lg"
                placeholder="Search for books or authors"
                required
              />
              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  style={{ position: "absolute", right: "6.5rem", top: "1rem" }}
                >
                  <svg className="w-6 h-6 text-gray-500" xmlns="http://www.w3.org/2000/svg"
                       fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              )}
              <SubmitButton
                text="Search"
                loadingText="Searching..."
                className="text-white items-center justify-center absolute end-2.5 bottom-2.5 bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 h-2/3"
              />
            </div>
          </motion.form>
          {books.length > 0 && (
            <>
              <BookList books={books}/>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span
                    className="font-medium">{books.length}</span> of{" "}
                    <span className="font-medium">{totalBooks}</span> results
                  </p>
                </div>
              </div>
              {totalBooks > 20 && (
                <div className="m-10 flex justify-center">
                  <form action={viewMoreBooksFormAction}>
                    <SubmitButton
                      text="View more Books"
                      loadingText="Loading..."
                      className="relative inline-flex items-center justify-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 pl-4 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:pointer-events-none disabled:opacity-40 "
                    />
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
