export type group = {
    id: number,
    name: string,
    status: 'Empty' | 'NotEmpty',
    created_at: Date
}

export type user = {
    id: number,
    name: string,
    email: string,
    created_at: Date
}

export type userGroups = {
    user_id: number,
    group_id: number
}