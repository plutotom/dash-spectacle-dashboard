import React, { useEffect, useState } from "react";
import { TodoistApi } from "@doist/todoist-api-typescript";
import { formatRelative } from "date-fns";

interface TodoType {
  id: string;
  content: string;
  order: number;
  due?: {
    datetime: string;
  };
  assignedId?: string;
  assignerId?: string;
  commentCount?: number;
  createdAt?: string;
  creatorId?: string;
  description?: string;
  duration?: number;
  isCompleted?: boolean;
  labels?: string[];
  parentId?: string;
  priority?: number;
  projectId?: string;
  sectionId?: string;
  url?: string;
}

const today = new Date();
const fromNow = (date: string) => formatRelative(new Date(date), today);

function sortTodoByDueDateOrOrder(a: TodoType, b: TodoType) {
  const dateA = a.due?.datetime
    ? new Date(a.due?.datetime).getTime()
    : Infinity;
  const dateB = b.due?.datetime
    ? new Date(b.due?.datetime).getTime()
    : Infinity;
  return dateA - dateB || a.order - b.order;
}

function sortTodoByPriority(a: TodoType, b: TodoType) {
  const priorityA = a.priority || 1;
  const priorityB = b.priority || 1;
  return priorityA - priorityB;
}

const apiKey = process.env.REACT_APP_TODOIST_TOKEN || ""; // Replace with your Todoist API key
const api = new TodoistApi(apiKey);

const Todoist: React.FC = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const allTodos = await api.getTasks();
        setTodos(allTodos as TodoType[]);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);

  return (
    <div>
      <h4>Todoist Component</h4>
      {todos.length > 0 ? (
        <ul>
          {todos.sort(sortTodoByPriority).map((todo) => (
            <li key={todo.id}>
              {todo.content} -{" "}
              {todo.due?.datetime ? fromNow(todo.due?.datetime) : "No Due Date"}
            </li>
          ))}
        </ul>
      ) : (
        <p>No todos found.</p>
      )}
    </div>
  );
};

export default Todoist;
