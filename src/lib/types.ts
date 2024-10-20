export type PBUser = {
	username: string,
	email: string,
	emailVisibility: boolean
	password: string,
	passwordConfirm: string,
}

export type User = {
	id: string,
	username: string,
	password: string,
	email: string
}

export type ServerResponse = {
	success: boolean,
	message: string,
	error: string,
	data: any | null
}

export type EventType = {
	id: string
	title: string,
	description: string
	address?: string,
	date: string,
}

export type TodoType = {
	id: string,
	title: string,
	done: boolean
}

export type HabitType = {
	id: string,
	name: string,
	completed: string[],
	author: string
}

export enum RessourceTypeEnum {
	VIDEO = "video",
	TEXT = "text",
	PDF = "pdf",
}

export type RessourceType = {
	id: string,
	author: string,
	name: string,
	content: string,
	type: RessourceTypeEnum,
	notebook: string,
}

export type NotebookType = {
	id: string,
	author: string,
	name: string,
	description: string,
	notes: string[],
	ressources: string[],
}

export type NoteType = {
	id: string,
	author: string,
	title: string,
	content: string,
	ressources: string[],
	notebook: string
}
