import Groq from "groq-sdk";

const groq = new Groq();

export async function getGroqResponse(prompt,sys_prompt,model) {
  const startTime = performance.now();

  const chatCompletion = await groq.chat.completions.create({

    messages: [
      {
        role: "system",
        content: sys_prompt,
      },
      {
        role: "user",
        content: prompt,
      },
    ],

    model: model,

  });

  const endTime = performance.now();
  const responseTime = endTime - startTime;

  return {responseTime: responseTime, response: chatCompletion.choices[0]?.message?.content}
}


