import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/solid';

interface Column<T> {
  key: string;
  title: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  emptyMessage?: string;
  rowKey?: string | ((row: T) => string);
  onRowClick?: (row: T) => void;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
}

function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  sortColumn,
  sortDirection,
  onSort,
  emptyMessage = 'No data available',
  rowKey = 'id',
  onRowClick,
  className = '',
  striped = true,
  hoverable = true,
  compact = false,
}: TableProps<T>) {
  const getRowKey = (row: T): string => {
    if (typeof rowKey === 'function') {
      return rowKey(row);
    }
    return row[rowKey];
  };

  const getAlignmentClass = (align?: string) => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  const tableStyles = [
    'min-w-full divide-y divide-gray-200 dark:divide-gray-700',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const headerCellStyles = [
    'px-6 py-3 text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase',
    compact ? 'py-2' : 'py-3',
  ]
    .filter(Boolean)
    .join(' ');

  const bodyCellStyles = [
    'px-6 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200',
    compact ? 'py-2' : 'py-4',
  ]
    .filter(Boolean)
    .join(' ');

  const rowStyles = [
    'transition-colors duration-100',
    hoverable && 'hover:bg-gray-50 dark:hover:bg-gray-800',
    onRowClick && 'cursor-pointer',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <div className="overflow-x-auto">
        <table className={tableStyles}>
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`${headerCellStyles} ${getAlignmentClass(column.align)}`}
                  style={{ width: column.width }}
                >
                  {column.sortable ? (
                    <button
                      className="group inline-flex items-center space-x-1"
                      onClick={() => onSort?.(column.key)}
                    >
                      <span>{column.title}</span>
                      <span className="flex-none rounded ml-2">
                        {sortColumn === column.key ? (
                          sortDirection === 'desc' ? (
                            <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
                          )
                        ) : (
                          <ChevronUpIcon className="h-4 w-4 opacity-0 group-hover:opacity-50" aria-hidden="true" />
                        )}
                      </span>
                    </button>
                  ) : (
                    column.title
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={getRowKey(row)}
                  onClick={() => onRowClick?.(row)}
                  className={`
                    ${rowStyles}
                    ${striped && rowIndex % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}
                  `}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`${bodyCellStyles} ${getAlignmentClass(column.align)}`}
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
