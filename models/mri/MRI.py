from tensorflow.keras.preprocessing import image
import tensorflow as tf
import numpy as np


class MRIModel:
    def __init__(self):
        # self.model = tf.keras.models.load_model("models/mri/trained-models/mac-model.h5")
        self.model = tf.keras.models.load_model("models/mri/trained-models/final_brain_mri_classifier_model.h5")
        self.CLASSES = ["No_MRI", "MRI"]

    def preprocess(self, input_image):
        img = image.load_img(input_image, target_size=(224, 224))

        img_array = image.img_to_array(img)
        img_array = img_array / 255.0

        img_batch = np.expand_dims(img_array, axis=0)

        return img_batch

    def predict(self, image):
        preprocessed_image = self.preprocess(image)

        prediction = self.model.predict(preprocessed_image)

        return self.CLASSES[int(prediction[0][0])]
        # return self.CLASSES[np.argmax(prediction, axis=1)[0]]

    def isMRI(self, filepath):
        if self.predict(filepath) == "MRI":
            return True
        return False
