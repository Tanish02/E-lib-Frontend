"use client";
import React from "react";

const DownloadButton = ({ fileLink }: { fileLink: string }) => {
  const handleDownload = () => {
    window.open(fileLink, "_blank");
  };
  return (
    <button
      onClick={handleDownload}
      className="mt-10 h-10 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium
          text-white transition-all hover:bg-blue-600 active:bg-blue-700"
    >
      Download Book
    </button>
  );
};

// end code

export default DownloadButton;
