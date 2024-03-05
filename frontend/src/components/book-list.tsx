'use client';

import { BookVolume } from "@/lib/book";
import { motion } from "framer-motion";
import Image from "next/image";
import Tooltip from "rc-tooltip";
import { useFormStatus } from "react-dom";
import "rc-tooltip/assets/bootstrap.css";

function truncateDescription(description: string, wordLimit: number) {
  const words = description.split(' ');

  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }

  return description;
}

const BookList = ({ books }: { books: BookVolume[] }) => {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <div className="flex min-h-screen items-center justify-center w-full bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="card m-5 w-full flex flex-wrap justify-center gap-4" // Added gap-4 for spacing between cards
    >
      {books.map((book, index) => (
        <motion.div
          key={book.id}
          layout
          className="w-80 m-2" // Added m-2 for margin around each card
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="max-w-sm rounded overflow-hidden shadow-lg hover:shadow-2xl hover:cursor-pointer">
            <div className="flex justify-center">
              {book.volumeInfo?.imageLinks?.smallThumbnail ? (
                <Image
                  src={book.volumeInfo.imageLinks.smallThumbnail}
                  alt={book.volumeInfo.title}
                  width={200}
                  height={200}
                  objectFit="cover"
                />
              ) : (
                <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>
            <div className="px-6 py-4">
              <Tooltip
                overlay={<span>{book.volumeInfo?.title}</span>}
                placement="bottom"
              >
                <div
                  className="font-bold text-xl mb-2 overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ maxWidth: '100%' }}
                >
                  {book.volumeInfo?.title}
                </div>
              </Tooltip>
              <Tooltip
                overlay={
                  <span>{book.volumeInfo?.authors ? book.volumeInfo.authors.join(", ") : "Author(s) not available"}</span>}
                placement="bottom"
              >
                <p className="text-gray-700 text-base font-semibold" style={{ maxWidth: "100%" }}>
                  <span className="text-gray-900 font-bold">Author(s): </span>
                  {book.volumeInfo?.authors ? book.volumeInfo.authors.join(", ") : "Not available"}
                </p>
              </Tooltip>
              <div className="text-gray-700 text-base overflow-hidden line-clamp-2">
                <span className="text-gray-700 font-bold">Description: </span>
                {book.volumeInfo?.description ? (
                  <span className="text-gray-700">
                    {book.volumeInfo?.description}
                  </span>
                  ) : (
                  <span className="text-gray-400">Not available</span>
                )}
              </div>
              {book.volumeInfo?.description && (
                <Tooltip
                  overlay={<span>{truncateDescription(book.volumeInfo.description, 100)}</span>}
                  placement="bottom"
                  overlayStyle={{ maxWidth: '300px', whiteSpace: 'normal' }}
                >
                  <button className="text-blue-600 mt-1">Read more</button>
                </Tooltip>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BookList;