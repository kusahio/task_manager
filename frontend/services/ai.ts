import api from "@/utils/api";
import { TaskParseResponse } from "@/types/ai";

export const parseTaskWithAI = async (text: string): Promise<TaskParseResponse> => {
  const { data } = await api.post<TaskParseResponse>('/ai/parse-task', {text});

  return data;
}