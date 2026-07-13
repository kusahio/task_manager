# New Features & Next Steps

This document outlines the recently implemented backend features for the AI assistant and the next steps for frontend integration.

## ✅ Backend Features (Implemented)

### 1. RAG Conversational AI (`/api/v1/ai/chat`)
-   **File**: `backend/routers/ai.py`
-   **Service**: `backend/services/ai_service.py` -> `chat_with_ai()`
-   **Description**: A new `POST` endpoint that provides a full conversational experience.
    -   **RAG (Retrieval-Augmented Generation)**: Before calling the AI, the service retrieves the user's tags, task summary, and recent tasks from the database and injects them as context into the prompt.
    -   **Intent Recognition**: The AI can understand user intents like creating tasks, querying tasks, and managing tags from natural language.
    -   **Structured Output**: Returns a `ChatResponse` object containing a natural language message and a structured `action` (`create_tasks` or `none`) for the frontend to handle.
    -   **Read-Only**: This endpoint does not write to the database. It only plans actions for the frontend to execute after user confirmation.

### 2. AI-Powered Tag Suggestions (`/api/v1/ai/suggest`)
-   **File**: `backend/routers/ai.py`
-   **Service**: `backend/services/ai_service.py` -> `suggest_tags()`
-   **Description**: A `POST` endpoint that suggests relevant tags based on a task's title and description.
    -   It returns a list of tags, indicating whether each tag already `exists` for the user or is a `new` suggestion.

### 3. Atomic Tag & Task Creation
-   **File**: `backend/services/task_service.py` -> `create_task()`
-   **Schema**: `backend/schemas/task.py` -> `TaskCreate`
-   **Description**: The existing `POST /api/v1/tasks/` endpoint has been enhanced.
    -   The `TaskCreate` schema now accepts an optional `new_tag_names: List[str]`.
    -   When creating a task, the backend service will first create any tags from `new_tag_names` that do not already exist (with a default color) and then associate all tags (new and existing) with the task in a single operation.

## 🚀 Frontend Next Steps (To Be Implemented)

### 1. Refactor `AIChatPanel` Component
-   **File**: `frontend/components/AIChat/AIChatPanel.tsx`
-   **Action**: Rewrite the component to be a self-contained, tabbed interface.
    -   **Tabs**: Implement "Manual" and "Asistente IA" tabs.
    -   **Manual Mode**: Integrate a manual task creation form inside the panel.
    -   **AI Chat Mode**: Implement the conversational UI, including message rendering and a confirmation card for task creation.
    -   **FAB**: The panel should manage its own visibility via a Floating Action Button.

### 2. Update Frontend Types and Services
-   **Files**:
    -   `frontend/types/ai.ts`
    -   `frontend/types/chat.ts`
    -   `frontend/types/task.ts`
    -   `frontend/services/ai.ts`
-   **Action**: Add all the new TypeScript interfaces (`ChatResponse`, `TaskPreview`, etc.) and the new API service calls (`chatWithAI`, `suggestTaskData`).

### 3. Rewrite `useAIChat` Hook
-   **File**: `frontend/hooks/useAIChat.ts`
-   **Action**: Overhaul the hook to manage the state for both tabs, handle the new `POST /ai/chat` flow, and manage the confirmation state (`pendingAction`, `confirmTasks`, `cancelTasks`).

### 4. Simplify Task Creation/Editing Flow
-   **Files**:
    -   `frontend/app/(protected)/tasks/_components/TaskForm.tsx`
    -   `frontend/app/(protected)/tasks/page.tsx`
-   **Action**:
    -   Remove the task creation form from the main page layout. The `AIChatPanel` is now the primary creation tool.
    -   Refactor `TaskForm.tsx` to be used exclusively for **editing** existing tasks, likely displayed in a modal.

### 5. Install Dependencies
-   **File**: `frontend/package.json`
-   **Action**: Add `react-markdown` to render formatted AI responses.
