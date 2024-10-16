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
