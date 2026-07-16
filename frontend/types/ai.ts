export interface TaskParseResponse {
  title: string;
  description: string | null;
  deadline: string | null;
  tags: string[];
}

export interface TaskPreview {
  title: string;
  description: string | null;
  deadline: string | null;
  existing_tag_ids: number[];
  new_tag_names: string[];
}

export interface ChatAction {
  type: "create_tasks" | "none";
  data: { tasks: TaskPreview[] } | null;
}

export interface ChatResponse {
  action: ChatAction;
  message: string;
}

export interface TagSuggestionItem {
  name: string;
  exists: boolean;
  tag_id: number | null;
}

export interface SuggestResponse {
  suggested_tags: TagSuggestionItem[];
}