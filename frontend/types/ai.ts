export interface TaskParseResponse {
  title: string;
  description: string | null;
  deadline: string | null;
  tags: string[];
}