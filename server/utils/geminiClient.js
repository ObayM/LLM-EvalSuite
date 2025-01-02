import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function getGeminiResponse(user_prompt,sys_prompt,llm_model) {
    const startTime = performance.now();

    const model = genAI.getGenerativeModel({ model: llm_model,systemInstruction: sys_prompt });
    const prompt = user_prompt;
    const result = await model.generateContent(user_prompt);

    const endTime = performance.now();
    const responseTime = endTime - startTime;

    return {
        responseTime: responseTime,
        response: result.response.text()
    };
}

