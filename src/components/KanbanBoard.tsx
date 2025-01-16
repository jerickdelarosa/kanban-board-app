import PlusIcon from '../icons/PlusIcon'
import { useState } from 'react';
import { Column } from '../types/columnTypes';

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  console.log(columns);

  return (
    <div className="
        m-auto
        flex
        min-h-screen
        w-full
        items-center
        overflow-x-auto
        overflow-y-hidden
        px-[40px]
    ">
        <div className="m-auto flex gap-4">
            <div className="flex gap-4">
                {columns.map((column, index) => (
                    <div key={index}>{column.title}</div>
                ))}
            </div>
            <button
            onClick={() => createNewColumn()}
            className="
            h-[60px] w-[60px]
            min-w-[350px]
            cursor-pointer
            rounded-lg
            bg-mainBackgroundColor
            border-2
            border-columnBackgroundColor
            p-ring-rose-500
            hover:ring-2
            flex
            gap-2
            "> <PlusIcon /> Add Column</button>
        </div>
    </div>
  )

  function createNewColumn() {
    // This function will be called when the button is clicked
    const columnToAdd: Column = {
        id: generateId(),
        title: `Column ${columns.length + 1}`
    };

    // Add the new column to the columns state
    setColumns([...columns, columnToAdd]);
  }

  function generateId() {
    // This is a simple implementation of a random ID generator
    return Math.floor(Math.random() * 10001);
  }

}

export default KanbanBoard