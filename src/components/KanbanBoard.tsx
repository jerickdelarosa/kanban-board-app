import PlusIcon from '../icons/PlusIcon'
import { useMemo, useState } from 'react';
import { Column, Id, Task } from '../types/columnTypes';
import ColumnContainer from './ColumnContainer';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const columnsId = useMemo(() => columns.map(column => column.id), [columns]);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // displacement is needed to start the drag sequence
      },
    })
  );

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
      {/* DndContext is a component that provides the context for drag and drop interactions */}
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="m-auto flex gap-4">
            <div className="flex gap-4">
              <SortableContext items={columnsId}>
                {columns.map((column, index) => (
                    <ColumnContainer
                        key={index}
                        column={column}
                        tasks={tasks.filter(task => task.column === column.id)}
                        deleteColumn={deleteColumn}
                        updateColumn={updateColumn}
                        createTask={createTask}
                    />
                ))}
              </SortableContext>
            </div>
            <button
              onClick={() => createNewColumn()}
              className=" h-[60px] w-[350px]
              min-w-[350px]
              cursor-pointer
              rounded-lg
              bg-mainBackgroundColor
              border-2
              border-columnBackgroundColor
              p-4 ring-rose-500
              hover:ring-2
              flex
              gap-2
              ">
                <PlusIcon /> Add Column
            </button>
        </div>

        {/* DragOverlay is a component that renders the drag preview */}
        {
          createPortal(<DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
              /> 
            )}
          </DragOverlay>
          , document.body)
        }
      </DndContext>
    </div>
  )

  function createNewColumn() {
    // This function will be called when the button is clicked
    const newColumn: Column = {
        id: generateId(),
        title: `Column ${columns.length + 1}`
    };

    // Add the new column to the columns state
    setColumns([...columns, newColumn]);
  }

  function deleteColumn(id: Id) {
    // Filter out the column with the given ID
    const filteredColumns = columns.filter(column => column.id !== id);
    // Update the columns state
    setColumns(filteredColumns);
  }

  function updateColumn( id: Id, title: string) {
    // Find the column with the given ID
    const updatedColumns = columns.map(column => {
      // If the column ID does not match, return the column as is
      if (column.id !== id) return column;
      // If the column ID matches, update the title
      return {
        ...column,
        title
      };

    });
    // Update the columns state
    setColumns(updatedColumns);

  }

  function createTask(columnId: Id) {
    // This function will be called when the "Add Task" button is clicked
    const newTask: Task = {
        id: generateId(),
        column: columnId,
        content: `Task ${tasks.length + 1}`
    };

    // Add the new task to the tasks state
    setTasks([...tasks, newTask]);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const {active, over} = event;
    if(!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if(activeColumnId === overColumnId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(column => column.id === activeColumnId);
      const overColumnIndex = columns.findIndex(column => column.id === overColumnId);
      
      /* const newColumns = [...columns];
      newColumns.splice(activeColumnIndex, 1);
      newColumns.splice(overColumnIndex, 0, columns[activeColumnIndex]); */

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    })
  }

}


function generateId() {
  // This is a simple implementation of a random ID generator
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard