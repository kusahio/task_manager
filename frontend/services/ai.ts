import api from "@/utils/api";
import { TaskParseResponse, ChatResponse, SuggestResponse } from "@/types/ai";
import { ChatMessage } from "@/types/chat";

export const parseTaskWithAI = async (text: string): Promise<TaskParseResponse> => {
  const { data } = await api.post<TaskParseResponse>('/ai/parse-task', {text});

  return data;
}

export const chatWithAI = async (messages: ChatMessage[]): Promise<ChatResponse> => {
  const { data } = await api.post<ChatResponse>('/ai/chat', {
    messages: messages.map(message => ({role: message.role, content: message.content}))
  })

  return data;
}

export const suggestTaskData = async (title?: string, description?: string): Promise<SuggestResponse> => {
  const { data } = await api.post<SuggestResponse>('/ai/suggest', {
    title, 
    description
  });

  return data;
}