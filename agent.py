# Example code structure for API integration
import openai
from openai import OpenAI


class ChatGPTIntegration:
    def __init__(self, api_key):
        self.api_key = api_key
        self.agent_description = ""
        self.client = OpenAI(api_key=api_key)

    def get_response(self, patient_data, model_results, query):
        """
        Get insights from ChatGPT based on patient data and model results
        """
        # Format the prompt with relevant information
        prompt = self._format_prompt(patient_data, model_results, query)

        # Call the API
        response = self.client.chat.completions.create(
            model="gpt-4",  # or other appropriate model
            messages=[
                {"role": "system",
                 "content": "You are a medical assistant specialized in brain tumor analysis."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3  # Lower temperature for more focused medical responses)
        )
        return response.choices[0].message.content

    def _format_prompt(self, patient_data, model_results, query):
        # Create a structured prompt with all relevant information
        prompt = f"""
        Patient Information:
        {patient_data}

        Brain Tumor Detection Results:
        - Detection: {model_results['detection']}
        - Location: {model_results['location']}
        - Confidence: {model_results['confidence']}%

        Medical Query: {query}

        Provide analysis based on these findings.
        """
        return prompt



if __name__ == "__main__":
    api_key = "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"

    chatgpt = ChatGPTIntegration(api_key=api_key)



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
