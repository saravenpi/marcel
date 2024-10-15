import type { ServerResponse } from "./types"

export const SUCCESS_RESPONSE = (message: string, data?: any): ServerResponse => ({ success: true, message: message, error: "", data: data })
export const ERROR_RESPONSE = (message: string, data?: any): ServerResponse => ({ success: false, message: "", error: message, data: data })
