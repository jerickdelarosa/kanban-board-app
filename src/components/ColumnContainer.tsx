import { Column } from '../types/columnTypes';

interface Props {
    column: Column;

}

function ColumnContainer(props: Props) {
    const { column } = props;
  return (
    <div>{column.title}</div>
  )
}

export default ColumnContainer