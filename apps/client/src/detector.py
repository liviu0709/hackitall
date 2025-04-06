import mediapipe as mp
import cv2 as cv
from mediapipe.tasks import python

class GestureRecognizer:
    def __init__(self, model_path='gesture_recognizer_game.task'):
        self.model_path = model_path
        self.category = "not detected"
        self.score = 0
        self.center = [(0, 0) for _ in range(21)]
        self.frame_width = 640  # default pentru webcam
        self.frame_height = 480

        # Setup MediaPipe Gesture Recognizer
        self.BaseOptions = mp.tasks.BaseOptions
        self.GestureRecognizer = mp.tasks.vision.GestureRecognizer
        self.GestureRecognizerOptions = mp.tasks.vision.GestureRecognizerOptions
        self.GestureRecognizerResult = mp.tasks.vision.GestureRecognizerResult
        self.VisionRunningMode = mp.tasks.vision.RunningMode

        self.recognizer = self.initialize_gesture_recognizer()

    def initialize_gesture_recognizer(self):
        def print_result(result: self.GestureRecognizerResult, output_image: mp.Image, timestamp_ms: int):
            if not result.hand_landmarks:
                self.category = "not detected"
                return

            for gesture in result.gestures:
                if gesture:
                    self.category = gesture[0].category_name
                    self.score = gesture[0].score

        options = self.GestureRecognizerOptions(
            base_options=self.BaseOptions(model_asset_path=self.model_path),
            running_mode=self.VisionRunningMode.LIVE_STREAM,
            result_callback=print_result
        )

        return self.GestureRecognizer.create_from_options(options)

    def process_frame(self, frame):
        if frame is None:
            self.category = "not detected"
            return

        self.frame_height, self.frame_width = frame.shape[:2]
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame)
        timestamp_ms = cv.getTickCount() // cv.getTickFrequency() * 1000

        self.recognizer.recognize_async(mp_image, int(timestamp_ms))

    def get_current_letter(self):
        return self.category if self.category else "not detected"
