import React, { useState } from 'react';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/outline';

interface TreeNode {
  id: string | number;
  label: string;
  children?: TreeNode[];
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TreeViewProps {
  data: TreeNode[];
  onSelect?: (node: TreeNode) => void;
  defaultExpanded?: boolean;
  expandedIds?: (string | number)[];
  selectedId?: string | number;
  className?: string;
}

const TreeView: React.FC<TreeViewProps> = ({
  data,
  onSelect,
  defaultExpanded = false,
  expandedIds: controlledExpandedIds,
  selectedId,
  className = '',
}) => {
  const [expandedState, setExpandedState] = useState<Record<string | number, boolean>>(
    data.reduce((acc, node) => {
      acc[node.id] = defaultExpanded;
      return acc;
    }, {} as Record<string | number, boolean>)
  );

  const isExpanded = (nodeId: string | number) => {
    if (controlledExpandedIds) {
      return controlledExpandedIds.includes(nodeId);
    }
    return expandedState[nodeId];
  };

  const toggleExpand = (nodeId: string | number) => {
    if (!controlledExpandedIds) {
      setExpandedState((prev) => ({
        ...prev,
        [nodeId]: !prev[nodeId],
      }));
    }
  };

  const TreeNode: React.FC<{
    node: TreeNode;
    level: number;
  }> = ({ node, level }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isNodeExpanded = isExpanded(node.id);
    const isSelected = selectedId === node.id;

    return (
      <div>
        <div
          className={`
            flex items-center
            px-2 py-1.5
            rounded-md
            ${
              isSelected
                ? 'bg-primary-50 dark:bg-primary-900/20'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }
            ${node.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            transition-colors duration-150
          `}
          style={{ paddingLeft: `${(level + 1) * 12}px` }}
          onClick={() => {
            if (!node.disabled) {
              if (hasChildren) {
                toggleExpand(node.id);
              }
              onSelect?.(node);
            }
          }}
        >
          <div className="w-5 h-5 flex-shrink-0">
            {hasChildren && (
              <>
                {isNodeExpanded ? (
                  <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                )}
              </>
            )}
          </div>
          {node.icon && (
            <div className="mr-2 flex-shrink-0 text-gray-400">{node.icon}</div>
          )}
          <span
            className={`
              text-sm
              ${isSelected ? 'font-medium' : 'font-normal'}
              ${
                node.disabled
                  ? 'text-gray-400 dark:text-gray-600'
                  : 'text-gray-900 dark:text-gray-100'
              }
            `}
          >
            {node.label}
          </span>
        </div>
        {hasChildren && isNodeExpanded && (
          <div>
            {node.children?.map((child) => (
              <TreeNode key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      {data.map((node) => (
        <TreeNode key={node.id} node={node} level={0} />
      ))}
    </div>
  );
};

interface TreeViewSearchProps extends Omit<TreeViewProps, 'data'> {
  data: TreeNode[];
  searchPlaceholder?: string;
}

export const TreeViewSearch: React.FC<TreeViewSearchProps> = ({
  data,
  searchPlaceholder = 'Search...',
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filterNodes = (nodes: TreeNode[], term: string): TreeNode[] => {
    return nodes
      .map((node) => {
        const matchesSearch = node.label
          .toLowerCase()
          .includes(term.toLowerCase());

        const filteredChildren = node.children
          ? filterNodes(node.children, term)
          : undefined;

        if (matchesSearch || (filteredChildren && filteredChildren.length > 0)) {
          return {
            ...node,
            children: filteredChildren,
          };
        }

        return null;
      })
      .filter((node): node is TreeNode => node !== null);
  };

  const filteredData = searchTerm ? filterNodes(data, searchTerm) : data;

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={searchPlaceholder}
          className={`
            w-full px-3 py-2
            border border-gray-300 dark:border-gray-600
            rounded-md
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-primary-500
          `}
        />
      </div>
      <TreeView data={filteredData} {...props} />
    </div>
  );
};

export default TreeView;
