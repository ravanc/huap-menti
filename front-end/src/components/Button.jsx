import React from "react";

export default function Button({ text, onClick, style }) {
  return (
    <div
      className={`bg-[#F1E9D8] text-[#90052B] text-lg py-2 px-4 rounded-full hover:cursor-pointer ${style}`}
      onClick={() => onClick()}
    >
      {text}
    </div>
  );
}
