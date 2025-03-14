import React, { useState, useMemo } from 'react';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SortAscendingIcon,
  SortDescendingIcon,
} from '@heroicons/react/solid';

interface Column<T> {
  field: keyof T;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataGridProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  sortable?: boolean;
  selectable?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
}

function DataGrid<T extends { id?: string | number }>({
  data,
  columns,
  pageSize = 10,
  sortable = true,
  selectable = false,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  onRowClick,
  onSelectionChange,
}: DataGridProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  const sortedData = useMemo(() => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(data.length / pageSize);

  const handleSort = (field: keyof T) => {
    if (!sortable) return;

    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelection = checked ? paginatedData : [];
    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSelectRow = (row: T, checked: boolean) => {
    const newSelection = checked
      ? [...selectedRows, row]
      : selectedRows.filter((r) => r !== row);
    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  const isSelected = (row: T) => selectedRows.includes(row);

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {selectable && (
              <th scope="col" className="w-12 px-3 py-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={selectedRows.length === paginatedData.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={String(column.field)}
                scope="col"
                className={`
                  px-6 py-3 text-left text-xs font-medium
                  text-gray-500 dark:text-gray-400 uppercase tracking-wider
                  ${column.sortable !== false && sortable ? 'cursor-pointer' : ''}
                  ${column.width ? `w-${column.width}` : ''}
                `}
                onClick={() =>
                  column.sortable !== false && sortable && handleSort(column.field)
                }
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {column.sortable !== false && sortable && (
                    <span className="flex flex-col">
                      {sortField === column.field ? (
                        sortDirection === 'asc' ? (
                          <SortAscendingIcon className="h-4 w-4" />
                        ) : (
                          <SortDescendingIcon className="h-4 w-4" />
                        )
                      ) : (
                        <>
                          <ChevronUpIcon className="h-3 w-3 -mb-1" />
                          <ChevronDownIcon className="h-3 w-3" />
                        </>
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                Loading...
              </td>
            </tr>
          ) : paginatedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            paginatedData.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className={`
                  ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}
                  ${isSelected(row) ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
                `}
                onClick={() => onRowClick?.(row)}
              >
                {selectable && (
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={isSelected(row)}
                      onChange={(e) => handleSelectRow(row, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={String(column.field)}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                  >
                    {column.render
                      ? column.render(row[column.field], row)
                      : String(row[column.field] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing{' '}
              <span className="font-medium">
                {(currentPage - 1) * pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(currentPage * pageSize, data.length)}
              </span>{' '}
              of <span className="font-medium">{data.length}</span> results
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`
                p-2 rounded-md
                ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }
              `}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`
                p-2 rounded-md
                ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }
              `}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataGrid;
