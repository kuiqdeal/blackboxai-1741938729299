import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  className?: string;
  maxWidth?: string;
  arrow?: boolean;
  disabled?: boolean;
  interactive?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200,
  className = '',
  maxWidth = '200px',
  arrow = true,
  disabled = false,
  interactive = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const updatePosition = () => {
    if (!targetRef.current || !tooltipRef.current) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    const spacing = arrow ? 8 : 4;
    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        y = targetRect.top - tooltipRect.height - spacing;
        break;
      case 'right':
        x = targetRect.right + spacing;
        y = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        break;
      case 'bottom':
        x = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        y = targetRect.bottom + spacing;
        break;
      case 'left':
        x = targetRect.left - tooltipRect.width - spacing;
        y = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        break;
    }

    // Keep tooltip within viewport
    x = Math.max(spacing, Math.min(x, window.innerWidth - tooltipRect.width - spacing));
    y = Math.max(spacing, Math.min(y, window.innerHeight - tooltipRect.height - spacing));

    setCoords({ x, y });
  };

  useEffect(() => {
    if (isVisible) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isVisible]);

  const arrowPosition = {
    top: 'bottom-[-6px] left-1/2 -translate-x-1/2 border-t-gray-700 dark:border-t-gray-200',
    right: 'left-[-6px] top-1/2 -translate-y-1/2 border-r-gray-700 dark:border-r-gray-200',
    bottom: 'top-[-6px] left-1/2 -translate-x-1/2 border-b-gray-700 dark:border-b-gray-200',
    left: 'right-[-6px] top-1/2 -translate-y-1/2 border-l-gray-700 dark:border-l-gray-200',
  };

  return (
    <>
      <div
        ref={targetRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          style={{
            position: 'fixed',
            left: coords.x,
            top: coords.y,
            maxWidth,
          }}
          onMouseEnter={interactive ? showTooltip : undefined}
          onMouseLeave={interactive ? hideTooltip : undefined}
          className={`
            z-50 px-2 py-1
            text-sm text-white dark:text-gray-900
            bg-gray-700 dark:bg-gray-200
            rounded shadow-lg
            ${className}
          `}
        >
          {content}
          {arrow && (
            <div
              className={`
                absolute w-3 h-3
                transform rotate-45
                border-4 border-transparent
                ${arrowPosition[position]}
                bg-inherit
              `}
            />
          )}
        </div>
      )}
    </>
  );
};

interface TooltipGroupProps {
  children: React.ReactNode;
  position?: TooltipProps['position'];
  delay?: TooltipProps['delay'];
  maxWidth?: TooltipProps['maxWidth'];
  arrow?: TooltipProps['arrow'];
  className?: string;
}

export const TooltipGroup: React.FC<TooltipGroupProps> = ({
  children,
  position,
  delay,
  maxWidth,
  arrow,
  className = '',
}) => {
  return (
    <div className={`inline-flex gap-2 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === Tooltip) {
          return React.cloneElement(child, {
            position: position || child.props.position,
            delay: delay || child.props.delay,
            maxWidth: maxWidth || child.props.maxWidth,
            arrow: arrow ?? child.props.arrow,
          });
        }
        return child;
      })}
    </div>
  );
};

export default Tooltip;
