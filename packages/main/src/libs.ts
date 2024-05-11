export const sha256 = async (text: string): Promise<string> =>
	crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then((array_buffer) =>
		Array.from(new Uint8Array(array_buffer))
			.map((b) => b.toString(16).padStart(2, '0'))
			.join(''),
	);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const log = (obj: any): any => console.log(obj) === undefined && obj;

export const addSearchParams = (url: URL, params: Record<string, string> = {}): URL =>
	new URL(
		`${url.origin}${url.pathname}?${new URLSearchParams(
			Object.entries(Object.fromEntries([...Array.from(url.searchParams.entries()), ...Object.entries(params)])),
		).toString()}`,
	);

export const undefinedEmpty = <T>(obj: T) => (obj === undefined ? [] : [obj]);
