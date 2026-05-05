const btoa = require('btoa');

exports.handler = async (event) => {
  // 仅允许 POST 请求
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { category, question, choiceA, choiceB } = JSON.parse(event.body);

    // 构造提示词
    const prompt = `你是一位毒舌又精辟的情感专家。
现有两个人就“${category}”领域的问题进行测试。
问题是：“${question}”
A 的观点是：“${choiceA}”
B 的观点是：“${choiceB}”
请针对这两人的分歧点，写一段 60 字以内的锐评，要犀利、幽默，能一针见血地指出他们相处的隐患或萌点。`;

    // 使用原生的 fetch 发送请求 (Node.js 18+ 在 Netlify 环境默认支持)
    const response = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.AI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-V3", // 或者你选择的其他模型
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ result: data.choices[0].message.content })
    };

  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AI 思考过度，请稍后再试" })
    };
  }
};
