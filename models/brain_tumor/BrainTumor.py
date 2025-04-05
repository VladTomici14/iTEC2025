from tensorflow.keras.preprocessing import image
import tensorflow as tf
import numpy as np


class BrainTumorModel:
    def __init__(self):
        self.model = tf.keras.models.load_model("models/brain_tumor/trained-models/mac-model.h5")
        self.CLASSES = ["No_Tumor", "Tumor"]

    def preprocess(self, input_image):
        img = image.load_img(input_image, target_size=(224, 224))

        img_array = image.img_to_array(img)
        img_array = img_array / 255.0

        img_batch = np.expand_dims(img_array, axis=0)

        return img_batch

    def predict(self, image):
        # Preprocess the image
        preprocessed_image = self.preprocess(image)

        # Make a prediction
        prediction = self.model.predict(preprocessed_image)

        return self.CLASSES[np.argmax(prediction, axis=1)[0]]

    def hasBrainTumor(self, filepath):
        if self.predict(filepath) == "Tumor":
            return True
        return False
