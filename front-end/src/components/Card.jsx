import React from "react";

export default function Card({ text, response, onDelete }) {
  return (
    <div className="p-3 border border-gray-200 bg-white rounded-lg w-[25ch] flex items-start gap-2 mb-3 mx-2 max-md:w-[80vw]">
      <div className="flex flex-col">
        <div className="w-full break-words overflow-hidden font-bold">
          {text}
        </div>
        <div className="w-full break-words overflow-hidden italic pt-1">
          {response}
        </div>
      </div>
      <div
        className="hover:cursor-pointer text-[10px] text-gray-500 flex-shrink-0"
        onClick={onDelete}
      >
        ✖
      </div>
    </div>
  );
}
