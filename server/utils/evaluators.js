import { GoogleGenerativeAI } from "@google/generative-ai";
import { getGeminiResponse } from "./geminiClient.js";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004"});

export function cosineSimilarity(vector1, vector2) {
    const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
    const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));

    if (magnitude1 === 0 || magnitude2 === 0) {
        return 0; 
    }
    return dotProduct / (magnitude1 * magnitude2);
}

async function embedText(text) {
    try {
        const result = await model.embedContent({model: "text-embedding-004", content: {parts: [{text}]}});
        console.log(result.embedding.values)

        return result.embedding.values;
    } catch (error) {
        console.error("Error embedding text:", error);
        return null;
    }
}

export async function textSimilarity(text1, text2) {
    try {
        const vec1 = await embedText(text1);
        const vec2 = await embedText(text2);

        if (vec1 === null || vec2 === null) {
            console.error("One or both embeddings failed.");
            return 0; 
        }
        console.log(vec1,vec2)

        return cosineSimilarity(vec1, vec2);
    } catch (error) {
        console.error("Error calculating text similarity:", error);
        return 0; // Or handle the error as needed
    }
}


export async function LLMEvaluate(response,expected_output, model){
    const user_prompt=`compare these results , this is the LLM response: ${response} and this is the expected output ${expected_output} `
    const sys_prompt = `you are an LLM evaluator you will get the llm reponse and the expected response then reurn a number from 0 to 1 indecating its accuracy and also a short comment on the LLM performance 
    You MUST use this JSON format 
    {
        "score": 0.90,
        "comment":"your comment should be here"
    }`
    const llm_model=model
    response = await getGeminiResponse(user_prompt,sys_prompt,llm_model)
    return response
}



