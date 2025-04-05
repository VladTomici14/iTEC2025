
from PIL import Image
import os

class FileProcessing:
    def __init__(self):
        pass

    # Check if the file is an image
    def isImage(self, filename):

        if not os.path.isfile(filename):
            return False
        try:
            with Image.open(filename) as img:
                img.verify()
            return True
        except (IOError, SyntaxError):
            return False

    def read_file(self):
        with open(self.file_path, 'r') as file:
            data = file.readlines()
        return data

    def write_file(self, data):
        with open(self.file_path, 'w') as file:
            file.writelines(data)

class FileStructure:
    def __init__(self, base_path, isMri=False, hasTumor=False):
        self.base_path = base_path
        self.isMri = isMri
        self.hasTumor = hasTumor