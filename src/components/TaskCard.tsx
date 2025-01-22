import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import { Id, Task } from "../types/columnTypes";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
    task: Task;
    deleteTask: (id: Id) => void;
    updateTask: (id: Id,  content: string, priority: 'low' | 'medium' | 'high') => void;
}

function TaskCard(props: Props) {
  const { task, deleteTask, updateTask } = props;
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [priority, setPriority] = useState(task.priority);
  const [priorityMode, setPriorityMode] = useState(false);

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

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPriority = e.target.value as 'low' | 'medium' | 'high';
    setPriority(newPriority);
    updateTask(task.id, task.content, newPriority);
  };

  const priorityLevel = task.priority === 'low' ? 'text-green-700 bg-green-50 ring-green-600/20' : task.priority === 'medium' ? 'text-yellow-800 bg-yellow-50 ring-yellow-600/20' : 'text-red-700 bg-red-50 ring-red-600/10';

  const changePriority = () => {
    setPriorityMode((prev) => !prev);
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
                border-slate-600 rounded-xl hover:ring-2 cursor-grab relative"
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
        className="bg-mainBackgroundColor px-4 py-2 h-auto min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-slate-600 cursor-grab relative"
      >
        <textarea
          className="h-[90%] w-full resize-none rounded border-none bg-transparent focus:outline-none font-medium"
          value={task.content}
          autoFocus
          placeholder="Enter task content"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if(e.key === 'Enter' && e.shiftKey) toggleEditMode();
          }}
          onChange={e => updateTask(task.id, e.target.value, priority)}
        >
          
        </textarea>
      </div>
    )
  }

  if(priorityMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-mainBackgroundColor px-4 py-2 h-auto min-h-[100px] items-start flex flex-col text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-slate-600 cursor-grab relative task"
      >
        <select
        value={priority}
        onChange={handlePriorityChange}
        onBlur={changePriority}
        onKeyDown={(e) => {
          if(e.key === 'Enter') changePriority();
        }}
        className={`text-center w-16 items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium appearance-none ${priorityLevel} text-center`}
        >
          <option className="font-medium text-xs bg-white text-slate-600" value="low">Low</option>
          <option className="font-medium text-xs bg-white text-slate-600" value="medium">Medium</option>
          <option className="font-medium text-xs bg-white text-slate-600" value="high">High</option>
        </select> 

        <p className="my-2 h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap font-medium">
        {task.content}
        </p>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-mainBackgroundColor px-4 py-2 h-auto min-h-[100px] items-start flex flex-col text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-slate-600 cursor-grab relative task"
      onMouseEnter={() => {
        setMouseIsOver(true)
      }}
      onMouseLeave={() => {
        setMouseIsOver(false)
      }}
    > 
      
      <span onClick={changePriority} className={`text-center w-16 items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium ${priorityLevel}`}>
        {task.priority === 'low' ? "Low" : task.priority === 'medium' ? "Medium" : "High"}
      </span>
      
      <p onClick={toggleEditMode} className="mt-2 mb-6 h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap font-medium">
        {task.content}
      </p>
      
      {
        mouseIsOver && (
        <button
          onClick={() => deleteTask(task.id)}
          className="stroke-slate-600 absolute right-4 top-1/2 -translate-y-1/2 bg-transparent rounded opacity-60 hover:opacity-100">
          <TrashIcon />
        </button>)                                                
      }     
      
    </div>
  )
}

export default TaskCard