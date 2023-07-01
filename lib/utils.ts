import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import abbreviationsData from "../app/bibles/en/abbreviations.json";
import keysData from "../app/bibles/en/key.json";
import tkjvData from "../app/bibles/en/t-kjv.json";
// import versions from '../app/bibles/en/versions.json';

import { Abbreviation, KeysJSON, TKJVJSON } from "@/types";

const abbreviations = abbreviationsData as Abbreviation[];
const keys = keysData as KeysJSON;
const tkjv = tkjvData as TKJVJSON;

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function splitScriptureReference(ref: string) {
	const regex = /(\d*\s*\D+)\s+(\d+)(?::(\d+))?/;
	const matches = ref.match(regex);

	if (!matches) return null;

	const book = matches[1].trim();
	const chapter = matches[2];
	const verse = matches[3];

	// Convert abbreviation to standard book name if needed
	const standardBookName = getBookNameFromAbbreviation(book) || book;

	return {
		book: standardBookName,
		chapter,
		verse,
	};
}

function isBookMatch(input: string, bookName: string) {
	return bookName.toLowerCase().startsWith(input.toLowerCase());
}

function isAbbreviationMatch(input: string, abbreviation: string) {
	return abbreviation.toLowerCase().startsWith(input.toLowerCase());
}

export function getSuggestions(input: string) {
	const [bookInput, chapterAndVerseInput] = input.split(" ");
	const [chapterInput, verseInput] = chapterAndVerseInput?.split(":") || [];

	let suggestions: string[] = [];

	// Step 1: Suggest books
	if (!chapterAndVerseInput) {
		abbreviations.forEach(({ a }) => {
			const bookName = getBookNameFromAbbreviation(a);
			if (bookName) {
				if (
					isBookMatch(bookInput, bookName) ||
					isAbbreviationMatch(bookInput, a)
				) {
					suggestions.push(bookName);
				}
			}
		});
		return suggestions;
	}

	// Step 2: Suggest chapters
	if (!verseInput) {
		const standardBookName =
			getBookNameFromAbbreviation(bookInput) || bookInput;
		const bookInfo = keys.resultset.keys.find(
			(k) => k.n.toLowerCase() === standardBookName.toLowerCase()
		);

		if (bookInfo) {
			for (let i = 1; i <= bookInfo.c; i++) {
				if (i.toString().startsWith(chapterInput)) {
					suggestions.push(`${standardBookName} ${i}`);
				}
			}
		}
		return suggestions;
	}

	// Step 3: Suggest verses
	if (verseInput) {
		const standardBookName =
			getBookNameFromAbbreviation(bookInput) || bookInput;
		const bookInfo = keys.resultset.keys.find(
			(k) => k.n.toLowerCase() === standardBookName.toLowerCase()
		);

		if (bookInfo) {
			const versesInChapter = tkjv.resultset.row.filter(
				(row) =>
					row.field[1] === bookInfo.b &&
					row.field[2] === Number(chapterInput)
			).length;

			for (let i = 1; i <= versesInChapter; i++) {
				if (i.toString().startsWith(verseInput)) {
					suggestions.push(
						`${standardBookName} ${chapterInput}:${i}`
					);
				}
			}
		}
	}

	return suggestions;
}

export function isValidScriptureReference(ref: string) {
	const parsedRef = splitScriptureReference(ref);

	if (!parsedRef) {
		return false;
	}

	const { book, chapter, verse } = parsedRef;
	const hasVerse = !!verse;

	// Check if book is valid (using abbreviation or full name)
	const abbreviation = abbreviations.find(
		(a) => a.a.toLowerCase() === book.toLowerCase()
	);
	const keyBook = keys.resultset.keys.find(
		(k) => k.n.toLowerCase() === book.toLowerCase()
	);

	if (!abbreviation && !keyBook) {
		return false;
	}

	let bookNumber: number;
	if (abbreviation) {
		bookNumber = abbreviation.b;
	} else if (keyBook) {
		bookNumber = keyBook.b;
	}

	const chaptersInBook = keys.resultset.keys.find(
		(k) => k.b === bookNumber
	)?.c;

	if (chaptersInBook === undefined) {
		return false;
	}

	// Check if chapter and verse are numbers and within the valid range
	const chapterNumber = Number(chapter);
	const verseNumber = Number(verse);

	const isValidChapter =
		Number.isInteger(chapterNumber) &&
		chapterNumber > 0 &&
		chapterNumber <= chaptersInBook;

	if (hasVerse) {
		// Check if verse is within the valid range for the chapter
		const versesInChapter = tkjv.resultset.row.filter(
			(row) =>
				row.field[1] === bookNumber && row.field[2] === chapterNumber
		).length;
		const isValidVerse =
			Number.isInteger(verseNumber) &&
			verseNumber > 0 &&
			verseNumber <= versesInChapter;

		return (abbreviation || keyBook) && isValidChapter && isValidVerse;
	} else {
		return (abbreviation || keyBook) && isValidChapter;
	}
}

// Function to get the standard name of a book using abbreviation
export function getBookNameFromAbbreviation(abbreviation: string) {
	const entry = abbreviations.find(
		(a) => a.a.toLowerCase() === abbreviation.toLowerCase()
	);
	if (entry) {
		return keys.resultset.keys.find((k) => k.b === entry.b)?.n || null;
	}
	return null;
}

// Function to get book info by ID
export function getBookInfoById(bookId: number) {
	return keys.resultset.keys.find((k) => k.b === bookId) || null;
}

// Function to get the verse text
export function getVerse(
	book: string,
	chapter: number,
	verse: number,
	version = "t_kjv"
) {
	const bookId = keys.resultset.keys.find(
		(k) => k.n.toLowerCase() === book.toLowerCase()
	)?.b;
	if (!bookId) return null;

	const verseId = parseInt(
		`${bookId}${String(chapter).padStart(3, "0")}${String(verse).padStart(
			3,
			"0"
		)}`,
		10
	);

	if (version === "t_kjv") {
		return (
			tkjv.resultset.row.find((r) => r.field[0] === verseId)?.field[4] ||
			null
		);
	}
	// You can add support for additional versions here
	return null;
}
