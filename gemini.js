import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey:"AIzaSyB80qaKOvaWjyyc0VOD-2Y9aZiVT2fYrWo"});

const response = async (category, productName) => {
  try {
    const isMedicine = category.toLowerCase().includes("medicine");
    
    // Dynamic prompt parts based on category
    const focus = isMedicine 
      ? `detailed uses, therapeutic benefits, and clinical applications of ${productName}` 
      : `creative and delicious recipes using ${productName}`;
    
    const sourceRequirement = isMedicine 
      ? "- Include a 'Sources & References' section at the end citing reputable medical authorities (e.g., Mayo Clinic, NIH, WebMD, or FDA)."
      : "";
    
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `
        Topic: ${focus}
        Category: ${category}
        Product: ${productName}

        Requirements:
        - Do not include greetings, introductions, or meta-commentary.
        - Output only the content.
        - Structure: 
          1. Introduction: Overview of the ${category} and ${productName}.
          2. Body: ${isMedicine ? "Specific uses, dosage guidelines, and safety" : "Step-by-step recipes or preparation methods"}.
          3. Conclusion: Final tips or storage advice.
        ${sourceRequirement}
        - Total word count: Approximately 400 words.
      `,
    });
    const text = result.candidates[0].content.parts[0].text;
    return text.trim();
  } catch (error) {
    console.error("Error generating content:", error);
    throw error; // Re-throw so the API route can handle it
  }
};

export default response;
