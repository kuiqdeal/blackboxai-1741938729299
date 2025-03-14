import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  container?: Element;
  className?: string;
  onMount?: () => void;
  onUnmount?: () => void;
}

const Portal: React.FC<PortalProps> = ({
  children,
  container,
  className = '',
  onMount,
  onUnmount,
}) => {
  const [mountNode, setMountNode] = useState<Element | null>(null);

  useEffect(() => {
    let element = container;

    // If no container is provided, create one
    if (!element) {
      element = document.createElement('div');
      element.className = 'portal-container';
      if (className) {
        element.className += ` ${className}`;
      }
      document.body.appendChild(element);
    }

    setMountNode(element);
    onMount?.();

    return () => {
      // Only remove the element if we created it
      if (!container && element.parentElement) {
        element.parentElement.removeChild(element);
      }
      onUnmount?.();
    };
  }, [container, className, onMount, onUnmount]);

  return mountNode ? createPortal(children, mountNode) : null;
};

interface PortalGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const PortalGroup: React.FC<PortalGroupProps> = ({
  children,
  className = '',
}) => {
  const [container] = useState(() => {
    const element = document.createElement('div');
    element.className = `portal-group ${className}`;
    return element;
  });

  useEffect(() => {
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, [container]);

  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === Portal) {
          return React.cloneElement(child, { container });
        }
        return child;
      })}
    </>
  );
};

interface PortalStackProps extends PortalGroupProps {
  spacing?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const PortalStack: React.FC<PortalStackProps> = ({
  children,
  spacing = 16,
  position = 'bottom-right',
  className = '',
}) => {
  const positionStyles = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  };

  return (
    <PortalGroup
      className={`
        fixed z-50
        p-4
        pointer-events-none
        ${positionStyles[position]}
        ${className}
      `}
    >
      <div
        className="flex flex-col"
        style={{ gap: `${spacing}px` }}
      >
        {children}
      </div>
    </PortalGroup>
  );
};

interface PortalTransitionProps extends PortalProps {
  show: boolean;
  enter?: string;
  enterFrom?: string;
  enterTo?: string;
  leave?: string;
  leaveFrom?: string;
  leaveTo?: string;
  afterEnter?: () => void;
  afterLeave?: () => void;
}

export const PortalTransition: React.FC<PortalTransitionProps> = ({
  show,
  enter = 'transition-all duration-300 ease-out',
  enterFrom = 'opacity-0 scale-95',
  enterTo = 'opacity-100 scale-100',
  leave = 'transition-all duration-200 ease-in',
  leaveFrom = 'opacity-100 scale-100',
  leaveTo = 'opacity-0 scale-95',
  afterEnter,
  afterLeave,
  children,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [classes, setClasses] = useState('');

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (show) {
      setIsVisible(true);
      setClasses(`${enter} ${enterFrom}`);
      
      // Force a reflow
      document.body.offsetHeight;
      
      timeout = setTimeout(() => {
        setClasses(`${enter} ${enterTo}`);
        afterEnter?.();
      }, 10);
    } else {
      setClasses(`${leave} ${leaveFrom}`);
      
      timeout = setTimeout(() => {
        setClasses(`${leave} ${leaveTo}`);
        
        const transitionDuration = 200; // Match the duration in the leave class
        setTimeout(() => {
          setIsVisible(false);
          afterLeave?.();
        }, transitionDuration);
      }, 10);
    }

    return () => clearTimeout(timeout);
  }, [show, enter, enterFrom, enterTo, leave, leaveFrom, leaveTo, afterEnter, afterLeave]);

  if (!isVisible) return null;

  return (
    <Portal {...props}>
      <div className={classes}>{children}</div>
    </Portal>
  );
};

export default Portal;
