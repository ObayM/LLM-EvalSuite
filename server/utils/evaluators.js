const { GoogleGenerativeAI } = require("@google/generative-ai");
import { getGeminiResponse } from "./geminiClient";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004"});

export  function cosineSimilarity(vector1, vector2){
    const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));

    if (magnitude1 === 0 || magnitude2 === 0) {
        return 0; // Avoid division by zero
    }

    return dotProduct / (magnitude1 * magnitude2);
}

async function embedText(text) {
    const result = await model.embedContent(text);
    return result.embedding.values
}

export async function textSimilarity(text1,text2){
    const vec1 = await embedText(text1)
    const vec2 = await embedText(text2)
    return cosineSimilarity(vec1,vec2)
}


export async function LLMEvaluate(response,expected_output, model){
    response = await getGeminiResponse(
        prompt=`compare these results , this is the LLM response: ${response} and this is the expected output ${expected_output} `,
        sys_prompt = `you are an LLM evaluator you will get the llm reponse and the expected response then reurn a number from 0 to 1 indecating its accuracy and also a short comment on the LLM performance 
        You MUST use this JSON format 
        {
            "score": 0.90,
            "coment":"your comment should be here"
        }`,
        model="gemini-2.0-flash-exp"
    )
    return response
}



