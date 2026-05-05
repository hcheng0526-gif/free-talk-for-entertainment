exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { category, question, choiceA, choiceB } = JSON.parse(event.body);

    const prompt = `你是一位毒舌又精辟的情感专家。
现有两个人就“${category}”领域的问题进行测试。
问题是：“${question}”
A 的观点是：“${choiceA}”
B 的观点是：“${choiceB}”
请针对这两人的分歧点，写一段 60 字以内的锐评，要犀利、幽默，能一针见血地指出他们相处的隐患或萌点。`;

    // 注意这里！URL 也要确保是 DeepSeek 官方的地址
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        // 这里的名字必须和你在 Netlify 设置的一模一样
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat", 
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result: data.choices[0].message.content })
    };

  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "AI 思考过度，请稍后再试" })
    };
  }
};
