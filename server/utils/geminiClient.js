import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getGeminiResponse(prompt,sys_prompt,model) {
    const startTime = performance.now();

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: model,systemInstruction: sys_prompt });
    const prompt = prompt;
    const result = await model.generateContent(prompt);

    const endTime = performance.now();
    const responseTime = endTime - startTime;

    return {
        responseTime: responseTime,
        response: result.response.text()
    };
}

