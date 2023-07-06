import React, { useEffect, useRef } from "react";
import createHandLandMarker from "./handLandMarker";
import { DrawingUtils } from "@mediapipe/tasks-vision";
import { HandLandmarker } from "@mediapipe/tasks-vision";

function App() {
  // useRef for direct accessing dom elements

  const canvasRef = useRef(null); // for canvas
  const contextRef = useRef(null); // to update canvas
  const inputVideoRef = useRef(null); // for video

  useEffect(() => {
    // getting current value
    const canvas = canvasRef.current;
    const videoRef = inputVideoRef.current;
    if (canvas) {
      contextRef.current = canvas.getContext("2d"); // property of canvas which helps me to do draw on the canvas
    }
    if (contextRef.current && canvas && videoRef) {
      // model === tasks
      createHandLandMarker().then((handLandMarker) => {
        console.log(handLandMarker);
        const predict = () => {
          console.log("I am the best");
          canvas.style.width = videoRef.videoWith;
          canvas.style.height = videoRef.videoHeight;
          canvas.width = videoRef.videoWith;
          canvas.height = videoRef.videoHeight;

          const drawingUtils = new DrawingUtils(contextRef.current);
          let lastVideoTime = -1;
          let results = undefined;

          let startTimeMs = performance.now();
          if (lastVideoTime !== videoRef.currentTime) {
            lastVideoTime = videoRef.currentTime;
            results = handLandMarker.detectForVideo(videoRef, startTimeMs);
            console.log(results);
          }

          contextRef.current.save(); // maintains the previous state of the canvas style
          contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
          if (results.landmarks) {
            for (const landmark of results.landmarks) {
              drawingUtils.drawConnectors(
                landmark,
                HandLandmarker.HAND_CONNECTIONS,
                {
                  color: "#00FF00",
                  lineWidth: 2,
                }
              );
              drawingUtils.drawLandmarks(landmark, {
                color: "#FF0000",
                lineWidth: 2,
              });
            }
          }
          contextRef.current.restore();
          window.requestAnimationFrame(predict);
        };

        // it gives a stream which gives a 1MB chunck and give another chunk after the prvious one is processed
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          videoRef.srcObject = stream;
          videoRef.addEventListener("loadeddata", predict);
        });
      });
    }
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <video
        id="webcam"
        style={{ position: "absolute" }}
        autoPlay
        playsInline
        ref={inputVideoRef}
      ></video>
      <canvas
        ref={canvasRef}
        id="output_canvas"
        style={{
          position: "absolute",
          left: "0px",
          top: "0px",
        }}
      ></canvas>
    </div>
  );
}

export default App;
