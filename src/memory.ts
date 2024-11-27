import { JSONFilePreset } from "lowdb/node";
import type { AIMessage } from "../types";
import { v4 as uuidv4 } from 'uuid'

export type MessageWithMetadata = AIMessage & {
    id: string
    createdAt: string
}

type Data = {
    messages: MessageWithMetadata[]
}

export const addMetaData = (message: AIMessage) => {
    return {
        ...message,
        id: uuidv4(),
        createdAt: new Date().toISOString()
    }
}

export const removeMetadata = (message : MessageWithMetadata) => {
    const {id, createdAt, ...rest} = message;

    return rest;
}

const defualtData: Data = {
    messages: [],
}

export const getDb = async () => {
    const db = await JSONFilePreset<Data>('db.json', defualtData)
    return db
}

export const addMessages = async (messages: AIMessage[]) => {
    const db = await getDb()
    db.data.messages.push(...messages.map(addMetaData))
    await db.write()
}

export const getMessages = async () => {
    const db = await getDb()
    return db.data.messages.map(removeMetadata)
}

export const saveToolResponse = async (
    toolCallId: string,
    toolResponse: string
) => {
    return addMessages([
        {
            role: 'tool',
            content: toolResponse,
            tool_call_id: toolCallId
        }
    ])
}