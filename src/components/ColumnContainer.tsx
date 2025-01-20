import { Column, Id, Task } from '../types/columnTypes';
import TrashIcon from '../icons/TrashIcon';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import PlusIcon from '../icons/PlusIcon';
import TaskCard from './TaskCard';

interface Props {
    column: Column;
    deleteColumn: (id: Id) => void;
    updateColumn: (id: Id, title: string) => void;

    tasks: Task[];
    createTask: (columnId: Id) => void;
    deleteTask: (taskId: Id) => void;
    updateTask: (taskId: Id, content: string) => void;
}

function ColumnContainer(props: Props) {
    const { column, tasks, deleteColumn, updateColumn, createTask, deleteTask, updateTask } = props;

    const tasksIds = useMemo(() => {
      return tasks.map(task => task.id)
    }, [tasks]);

    const [editMode, setEditMode] = useState(false);

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
      id: column.id,
      data: {
        type: "Column",
        column,
      },
      disabled: editMode,
    })

    const style = {
      transition,
      transform: CSS.Translate.toString(transform),
    }

    if (isDragging) {
      return <div
                ref={setNodeRef}
                style={style}
                className="
                bg-columnBackgroundColor
                opacity-60
                border-2
                border-dashed
                border-rose-500
                w-[350px]
                h-[500px]
                max-h-[500px]
                rounded-md
                flex-col
              "></div>
    }
  return (
    <div
      ref={setNodeRef}
      style={style}

      className="
      bg-columnBackgroundColor
      w-[350px]
      h-[500px]
      max-h-[500px]
      rounded-md
      flex
      flex-col
    ">


      { /* Column Title */}
      <div
        {...attributes}
        {...listeners}

        onClick={() => setEditMode(true)}

        className="
        bg-mainBackgroundColor
        text-md
        h-[60px]
        cursor-grab
        rounded-md
        rounded-b-none
        p-3
        font-bold
        border-columnBackgroundColor
        border-4
        flex
        items-center
        justify-between
      ">
          <div className="flex gap-2">

                <div className="
                    flex
                    justify-center
                    items-center
                    bg-columnBackgroundColor
                    px-2
                    py-1
                    text-sm
                    rounded-full
                  ">{tasks.length}</div>
                
                  { !editMode && column.title }
                  { editMode && (
                    <input
                    className="bg-black focus:border-rose-500 border rounded outline-none px-2"
                      value={column.title}
                      onChange={e => updateColumn(column.id, e.target.value)}
                      autoFocus
                      onBlur={() => setEditMode(false)}
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter') return;
                        setEditMode(false);
                      }}
                    />
                  )}

          </div>

          <button
          onClick={() => deleteColumn(column.id)}
          className="
            stroke-gray-500 
            hover:stroke-white 
            hover:bg-columnBackgroundColor
            rounded px-1 py-2
          ">
            <TrashIcon />
          </button>

      </div>
        


      { /* Column Task Container */}
      <div className='flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto'>
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
          ))}
        </SortableContext>
      </div>


      { /* Column Footer */}
      <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
        onClick={() => createTask(column.id)}
      >
        <PlusIcon /> Add Task
      </button>

    </div>
  )
}

export default ColumnContainer