"use client"

import { motion } from "framer-motion"

import { getBookNameFromAbbreviation, getVerse } from "@/lib/utils"

export default function Reference({
    params,
}: {
    params: { book: string; chapter: number; verse: number }
}) {
    const { book, chapter, verse } = params

    // Decode URL components
    const decodedBook = decodeURIComponent(book)

    const standardBookName =
        getBookNameFromAbbreviation(decodedBook) || decodedBook

    // Fetch the verse text
    const verseText = getVerse(standardBookName, chapter, verse)
    return (
        <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{
                duration: 0.3,
            }}
        >
            <p className="my-6">{verseText}</p>
            <p className="my-6">{verseText}</p>
            <p className="my-6">{verseText}</p>
            <p className="my-6">{verseText}</p>
            <p className="my-6">{verseText}</p>
            <p className="my-6">{verseText}</p>
            <p className="my-6">{verseText}</p>
            <p className="my-6">{verseText}</p>
            <p className="my-6">{verseText}</p>
            <p className="my-6">{verseText}</p>
            <p className="my-6">{verseText}</p>
            <p className="my-6">{verseText}</p>
            <p className="my-6">{verseText}</p>
            <p className="my-6">{verseText}</p>
            <p className="my-6">{verseText}</p>
            <p className="my-6">{verseText}</p>
            <p className="my-6">{verseText}</p>
            <p className="my-6">{verseText}</p>
        </motion.div>
    )
}
