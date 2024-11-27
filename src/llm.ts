import type { AIMessage } from "../types";
import { openai } from "./ai";
import { zodFunction } from "openai/helpers/zod.js";
import { systemPrompt } from "./systemPrompt";

export const runLLM = async ({
    messages, tools,
} : { messages: AIMessage[], tools: any[]}) => {

    const formattedTools = tools.map(zodFunction)
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.1,
        messages: [{role: 'system', content: systemPrompt}, ...messages],
        tools: formattedTools,
        tool_choice: 'auto',
        parallel_tool_calls: false,
    })

    return response.choices[0].message
}