import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import { Id, Task } from "../types/columnTypes";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
    task: Task;
    deleteTask: (id: Id) => void;
    updateTask: (id: Id,  content: string) => void;
}

function TaskCard(props: Props) {
  const { task, deleteTask, updateTask } = props;
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging } = useSortable({
      id: task.id,
      data: {
        type: "Task",
        task,
      },
      disabled: editMode,
    })

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  }

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  }

  if(isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-mainBackgroundColor opacity-50 px-4 py-2 h-[100px] min-h-[100px] items-center flex text-left border-2 border-dashed
                border-rose-500 rounded-xl hover:ring-2 cursor-grab relative"
      />
    )
  }

  if(editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-mainBackgroundColor px-4 py-2 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
      >
        <textarea
          className="h-[90%] w-full resize-none rounded border-none bg-transparent text-white focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="Enter task content"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if(e.key === 'Enter' && e.shiftKey) toggleEditMode();
          }}
          onChange={e => updateTask(task.id, e.target.value)}
        >
          
        </textarea>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className="bg-mainBackgroundColor px-4 py-2 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative task"
      onMouseEnter={() => {
        setMouseIsOver(true)
      }}
      onMouseLeave={() => {
        setMouseIsOver(false)
      }}
    >
      
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>
      
      {
        mouseIsOver && (
        <button
          onClick={() => deleteTask(task.id)}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-transparent rounded opacity-60 hover:opacity-100">
          <TrashIcon />
        </button>)
      }
    </div>
  )
}

export default TaskCard