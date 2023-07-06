import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

const createHandLandMarker = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    // path/to/wasm/root
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );
  const handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      // input data, process, comparison
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task", //comparison data
      delegate: "GPU",
    },
    numHands: 2,
    runningMode: "VIDEO",
  });
  return handLandmarker;
};

export default createHandLandMarker;
