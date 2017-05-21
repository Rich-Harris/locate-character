interface Options {
	offsetLine?: number
	offsetColumn?: number
	startIndex?: number
}

export interface Location {
	line: number
	column: number
	character: number
}

export function locate ( source: string, search: string, options?: Options ): Location
export function locate ( source: string, search: number, options?: Options ): Location

export function getLocator ( source: string, options?: Options ): ( search: string, startIndex?: number ) => Location
export function getLocator ( source: string, options?: Options ): ( search: number ) => Location