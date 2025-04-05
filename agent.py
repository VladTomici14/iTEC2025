# Example code structure for API integration
import openai
from openai import OpenAI
from config import OPENAI_API_KEY


class ChatGPTIntegration:
    def __init__(self):
        self.agent_description = ""
        self.client = OpenAI(api_key=OPENAI_API_KEY)

        self.agent_description = (
            "You are, an intelligent assistant specializing in brain MRI analysis and tumor identification. "
            "You provide clear, medically-informed insights based on image analysis and patient messages. "
            "Your tone adapts to your audience: for medical professionals, you use concise clinical language; "
            "for patients, you explain findings simply, without causing alarm. Avoid unnecessary repetition. "
            "Be accurate, respectful, and to the point. If asked follow-up questions or casual prompts, respond briefly and informatively. "
            "You are here to assist, not to replace a medical diagnosis. Do not exaggerate findings or speculate beyond the data provided."
            "Don't use any salutations and don't refer to the user as 'user'."
        )

    def get_response(self, user_message, parsed_files):
        """
        Get insights from ChatGPT based on patient data and model results
        """
        # Format the prompt with relevant information
        prompt = self._format_prompt(user_message, parsed_files)

        # Call the API
        response = self.client.chat.completions.create(
            model="gpt-4",  # or other appropriate model
            messages=[
                {"role": "system",
                 "content": self.agent_description},
                {"role": "user",
                 "content": prompt}
            ],
            temperature=0.3  # Lower temperature for more focused medical responses)
        )
        return response.choices[0].message.content

    def _format_prompt(self, user_message, parsed_files):
        # Create a structured prompt with all relevant information

        file_descriptions = []

        for file in parsed_files:
            filename = file.get("filename", "Unnamed file")
            is_mri = file.get("is_mri", False)
            has_tumor = file.get("has_tumor", False)

            if not is_mri:
                file_descriptions.append(f"- '{filename}' is **not** identified as a brain MRI scan.")
            else:
                tumor_info = "shows signs of a brain tumor." if has_tumor else "does not show signs of a tumor."
                file_descriptions.append(f"- '{filename}' is a brain MRI and {tumor_info}")

        file_summary = "\n".join(file_descriptions)

        if len(file_summary):
            prompt = (
                f"User message:\n{user_message}\n\n"
                f"Image analysis summary:\n{file_summary}\n\n"
                f"Respond with clear, useful insights based on the message and the MRI findings. "
                f"Only include relevant medical interpretation. Avoid long introductions or repeating what was already said. "
                f"If the user is asking a follow-up or informal question, answer briefly and stay helpful."
            )
        else:
            prompt = (
                f"User message:\n{user_message}\n\n"
                f"Respond with clear, useful insights based on the message and the MRI findings. "
                f"Only include relevant medical interpretation. Avoid long introductions or repeating what was already said. "
                f"If the user is asking a follow-up or informal question, answer briefly and stay helpful."
            )
        return prompt


if __name__ == "__main__":
    chatgpt = ChatGPTIntegration()

    query = "What are the potential implications of this tumor location and what additional tests might be recommended?"

    patient_data = {
        "patient_id": "P12345",
        "age": 45,
        "gender": "Female",
        "medical_history": "Headaches for 3 months, episodes of blurred vision",
        "previous_treatments": "None related to neurological issues"
    }

    # Example model results from your brain tumor detection model
    model_results = {
        "detection": "Positive",
        "location": "Right frontal lobe",
        "confidence": 92.7,
        "size": "2.3 cm in diameter",
        "characteristics": "Well-defined borders, heterogeneous appearance"
    }

    analysis = chatgpt.get_response(patient_data, model_results, query)

    # Print or display the response
    print("AI Analysis:")
    print(analysis)
