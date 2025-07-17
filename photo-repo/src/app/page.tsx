"use client";

import { useState } from "react";
import CameraPanel from "./components/CameraPanel";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      
      {/* NavBar */}
      <nav className="w-full bg-gray-100 shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">📸 BIX OA Project</h1>
        
        <div className="space-x-4">
        
          {/* <a href="/tutorial" className="text-blue-600 hover:underline">Tutorial</a> */}
        </div>
      </nav>

      <div className="w-full flex flex-col items-center mt-10 px-4">
        <h2 className="text-2xl font-bold mb-4">📖 Photo Upload Tutorial</h2>
        <div className="flex items-center space-x-2 text-base">
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Start Camera</button>
          <span>→</span>
          <button className="px-3 py-1 bg-green-600 text-white rounded text-sm">Capture</button>
          <span>→</span>
          <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm">Upload</button>
          <span>→</span>
          <span className="">Click link to review photo</span>
        </div>
      </div>

     
      <main className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <CameraPanel />
      </main>
    </div>
  );
}