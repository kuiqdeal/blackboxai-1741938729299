import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';

interface CarouselProps {
  items: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
  slideClassName?: string;
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlay = false,
  interval = 5000,
  showArrows = true,
  showDots = true,
  className = '',
  slideClassName = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const next = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  }, [items.length]);

  const previous = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  }, [items.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(next, interval);
      return () => clearInterval(timer);
    }
  }, [isPlaying, interval, next]);

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      className={`
        relative group
        ${className}
      `}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(autoPlay)}
    >
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${items.length * 100}%`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className={`
                relative flex-shrink-0
                w-full
                ${slideClassName}
              `}
              style={{ width: `${100 / items.length}%` }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {showArrows && items.length > 1 && (
        <>
          <button
            onClick={previous}
            className={`
              absolute top-1/2 left-4 -translate-y-1/2
              p-2 rounded-full
              bg-black/30 text-white
              hover:bg-black/50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/50
              opacity-0 group-hover:opacity-100
              transition-opacity duration-200
            `}
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            className={`
              absolute top-1/2 right-4 -translate-y-1/2
              p-2 rounded-full
              bg-black/30 text-white
              hover:bg-black/50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/50
              opacity-0 group-hover:opacity-100
              transition-opacity duration-200
            `}
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </>
      )}

      {showDots && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                w-2 h-2 rounded-full
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/50
                ${
                  index === currentIndex
                    ? 'bg-white w-4'
                    : 'bg-white/50 hover:bg-white/75'
                }
              `}
            >
              <span className="sr-only">Go to slide {index + 1}</span>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={toggleAutoPlay}
        className={`
          absolute bottom-4 right-4
          p-2 rounded-full
          bg-black/30 text-white
          hover:bg-black/50
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/50
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
        `}
      >
        {isPlaying ? (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        <span className="sr-only">
          {isPlaying ? 'Pause autoplay' : 'Start autoplay'}
        </span>
      </button>
    </div>
  );
};

export default Carousel;
