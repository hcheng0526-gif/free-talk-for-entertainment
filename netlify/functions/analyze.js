exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { category, question, choiceA, choiceB } = JSON.parse(event.body);

    const prompt = `你是一位拥有心理学背景的情感对齐专家。
现有两个人就“${category}”领域产生分歧。
问题是：“${question}”
A 的观点是：“${choiceA}”
B 的观点是：“${choiceB}”
请运用心理学逻辑，用一句话深度剖析分歧背后的底层需求差异，并给出一个幽默的化解建议。要求语气专业且不失趣味，60字以内。`;

    // 注意这里！URL 也要确保是 xiaomi 官方的地址
    const response = await fetch("https://token-plan-cn.xiaomimimo.com/v1", {
      method: "POST",
      headers: {
        // 这里的名字必须和你在 Netlify 设置的一模一样
        "Authorization": `Bearer ${process.env.XIAOMI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "MiMo-V2.5-Pro", 
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8
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
