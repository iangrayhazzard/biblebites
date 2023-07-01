export interface Abbreviation {
	id: number;
	a: string;
	b: number;
	p: number;
}

export interface BookKey {
	b: number;
	c: number;
	n: string;
	t: string;
}

export interface KeysJSON {
	resultset: {
		keys: BookKey[];
	};
}

export interface VerseField {
	field: [number, number, number, number, string];
}

export interface TKJVJSON {
	resultset: {
		row: VerseField[];
	};
}

export interface VersionField {
	field: [string, string, string, string, string, string, string];
}

export interface VersionsJSON {
	resultset: {
		row: VersionField[];
	};
}
