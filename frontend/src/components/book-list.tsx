'use client';

import { BookVolume } from "@/lib/book";
import Tooltip from "rc-tooltip";
import { motion } from "framer-motion";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import 'rc-tooltip/assets/bootstrap.css';

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
    <div className="m-5">
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full flex flex-wrap justify-center gap-4" // Added gap-4 for spacing between cards
      >
        {books.map((book, index) => (
          <motion.div
            key={book.id}
            layout
            className="w-64 m-2" // Added m-2 for margin around each card
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-sm rounded overflow-hidden shadow-lg">
              {book.volumeInfo?.imageLinks?.thumbnail && (
                <Image
                  src={book.volumeInfo.imageLinks.thumbnail}
                  alt={book.volumeInfo.title}
                  width={200}
                  height={150}
                  objectFit="cover"
                />
              )}
              <div className="px-6 py-4">
                <Tooltip
                  overlay={
                    <span>
                      {book.volumeInfo?.title}
                    </span>
                  }
                  placement="bottom"
                >
                  <div
                    className="font-bold text-xl mb-2 overflow-hidden text-ellipsis whitespace-nowrap"
                    style={{ maxWidth: '100%' }}
                  >
                    {book.volumeInfo?.title}
                  </div>
                </Tooltip>
                <p
                  className="text-gray-700 text-base overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ maxWidth: '100%' }}
                >
                  {book.volumeInfo?.authors ? book.volumeInfo.authors.join(", ") : "Author(s) not available"}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default BookList;