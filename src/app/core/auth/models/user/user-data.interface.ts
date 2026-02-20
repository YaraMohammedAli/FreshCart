export interface UserDataResponse {
    message: string
    status?: string
    user?: UserData
    data?: UserData
    token: string
}

export interface UserData {
    _id: string
    name: string
    email: string
    role: string
}
