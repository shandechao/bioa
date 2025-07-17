"use client";

import { useRef, useState, useEffect } from "react";
import clsx from "clsx";


const photo_size={"width": 420, "height": 420};

export default function CameraPanel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  //const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasCaptured, setHasCaptured] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  type UploadResult = {
    status: "idle" | "uploading" | "completed" | "failed";
    url?: string; 
    msg?: string; // Optional message for error handling
  };
  const [uploadStatus, setUploadStatus] = useState<UploadResult>({ status: "idle" }); 
  //const [imgUrl, setImgUrl] = useState<string>("");
  
  const [isFirstTimeActive, setIsFirstTimeActive] = useState(false);


  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      //setIsCameraActive(true);
      //console.log("Camera started");

      if (!isFirstTimeActive) {
        setIsFirstTimeActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log(`Track ${track.kind} stopped`);
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    //setIsCameraActive(false);
    console.log("Camera stopped");
  };

  
  
  const handleCapture = () => {
  
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;

    setHasCaptured(true);
    
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (context) {
        canvas.width = photo_size.width;
        canvas.height = photo_size.height;

        /*
        const sx = (video.videoWidth - canvas.width) / 2;
        const sy = (video.videoHeight - canvas.height) / 2;
        context.drawImage(video, sx, sy, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        */
        const cropWidth = video.videoHeight * (canvas.width / canvas.height);
        const sx = (video.videoWidth - cropWidth) / 2;
        const sy = 0;

        context.drawImage(
          video,
          sx, sy,
          cropWidth, video.videoHeight,
          0, 0,
          canvas.width, canvas.height
        );
    } else {
        alert("cannot get canvas context");
    }

    stopCamera();
    
  };

  const handleUpload = () => {
    
    if (!canvasRef.current) {
      alert("No captured image to upload.");
      return;
    }
    setUploadStatus({status:"uploading"});
    
    const canvas = canvasRef.current;

    canvas.toBlob(async (blob) => {
      if (!blob) {
        alert("Failed to get image data.");
        return;
      }

      const formData = new FormData();
      formData.append("photo", blob, `photo_${Date.now()}.png`);
      formData.append("username", "user123"); 

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorText = await res.text();
          
          setUploadStatus({ status: "failed" ,"msg": JSON.stringify(errorText) });
          //throw new Error(`Upload failed: ${errorText}`);
          return ;
        }

        const data = await res.json();
        setUploadStatus({ status: "completed", url: data.url });
        console.log("Image URL:", data.url); // 
      } catch (error) {
        console.error("Upload error:", error);
        setUploadStatus({ status: "failed" , "msg": "Upload failed" });
      }
    }, "image/png");
    // Here you would typically handle the upload logic, e.g., sending the captured image to a server.
  };
  const handleRetake = () => {
    startCamera(); 
    setHasCaptured(false);
    setUploadStatus({ status: "idle" });
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);
  
 
  function UploadSuccess({ url_link }: { url_link: string }) {
    return (
      <div className="text-black-500 text-xl font-bold">
        <b className="block">✅ Upload Successful</b>
        <b className="block">
          View the uploaded image{" "}
          <a
            href={url_link}
            className="text-blue-300 underline hover:text-blue-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>.
        </b>
      </div>
    );
  }

  
  return (
      
      <div className="flex flex-col items-center">
          
          <div className={clsx("flex flex-col items-center", hasCaptured ? "block" : "hidden")}>
            <h2 className="text-2xl font-bold mb-6">📷 Captured Image</h2>
            
             <canvas ref={canvasRef} className="bg-white rounded shadow object-cover overflow-hidden" />
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleRetake}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-500 transition cursor-pointer"
              >
                🔄 Retake
              </button>
              {uploadStatus.status === "idle" && (
                <button
                  onClick={handleUpload}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition cursor-pointer"
                >
                  ⬆️ Upload
                </button>   
              )}

              {uploadStatus.status === "uploading" && (
                <>
                  <b>Uploading...</b>
                </>
              )}

              {uploadStatus.status === "completed" && uploadStatus.url && (
                <>
                  <UploadSuccess url_link={uploadStatus.url} />
                  
                </>
              )}

              {uploadStatus.status === "failed" && (
                <>
                  <b className="block text-red-600 text-xl font-bold">Upload Failed</b>
                  {uploadStatus.msg && (
                    <p className="block text-red-500">{uploadStatus.msg}</p>
                  )}
                
                </>
              )}
              
            </div>
          </div>
          <div className={clsx("flex flex-col items-center", hasCaptured ? "hidden" : "block")}>
          
            <h2 className="text-2xl font-bold mb-6">📷 Camera Panel</h2>
            <div className="bg-black rounded border overflow-hidden flex items-center justify-center"
              style={{ width: `${photo_size.width}px`, height: `${photo_size.height}px` }}
            >
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            </div>

            <div className="mt-4">
            {!isFirstTimeActive ? (
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition cursor-pointer"
              >
                Start Camera
              </button>
            ) : (
                <button
                  onClick={handleCapture}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition cursor-pointer"
                >
                  📸 Capture
                </button>
            )}
            </div>
          </div>
      </div>
    
  );
  

}