import React from 'react';

const Ruler: React.FC = () => {
  const seconds = Array.from({ length: 15 }, (_, i) => i + 1);

  return (
    <div className="ruler flex mt-4">
      {seconds.map(second => (
        <div key={second} className="ruler-second w-8 border-r text-center">
          {second}s
        </div>
      ))}
    </div>
  );
};

export default Ruler;