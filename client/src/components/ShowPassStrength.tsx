import React from "react";

interface ShowPassStrengthProps {
  strength: 0 | 1 | 2 | 3;
}
const ShowPassStrength = ({ strength }: ShowPassStrengthProps) => {
  return (
    <div className="flex gap-3">
      {Array.from({ length: strength + 1 }).map((i, index) => (
        <div
          key={index}
          className={`w-32 h-3 rounded-sm ${
            strength === 0
              ? "bg-red-500"
              : strength === 1
              ? "bg-orange-500"
              : strength === 2
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
        />
      ))}
    </div>
  );
};

export default ShowPassStrength;
