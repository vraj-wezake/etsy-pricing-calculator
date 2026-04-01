import { useState } from 'react';

export default function InfoTooltip({ text }) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-block ml-1">
      <span
        className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] cursor-help select-none"
        aria-label="Info"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
      >
        <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-gray-500 bg-gray-200 rounded-full">
          i
        </span>
      </span>
      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 px-3 py-2 text-xs text-white bg-gray-800 rounded-lg shadow-lg leading-relaxed">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
        </span>
      )}
    </span>
  );
}
