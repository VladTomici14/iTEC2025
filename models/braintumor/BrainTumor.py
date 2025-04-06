from tensorflow.keras.preprocessing import image
import tensorflow as tf
import numpy as np


class BrainTumorModel:
    def __init__(self):
        self.model = tf.keras.models.load_model("models/braintumor/trained-models/mac-model.h5")
        self.CLASSES = ["No_Tumor", "Tumor"]

    def preprocess(self, input_image):
        test_image = image.load_img(input_image, target_size=(400, 400))
        test_image = image.img_to_array(test_image)
        test_image = np.expand_dims(test_image, axis=0)

        return test_image

    def predict(self, image):
        # Preprocess the image
        preprocessed_image = self.preprocess(image)
        result = self.model.predict(preprocessed_image)

        if result[0][0] == 0:
            prediction = "The MRI image is no of BRAIN TUMOR"
        else:
            prediction = "The MRI image is of BRAIN TUMOR"
        print(result[0][0])
        return self.CLASSES[int(result[0][0])]

        # Make a prediction
        # prediction = self.model.predict(preprocessed_image)


    def hasBrainTumor(self, filepath):
        if self.predict(filepath) == "Tumor":
            return True
        return False
