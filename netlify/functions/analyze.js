exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { category, question, choiceA, choiceB } = JSON.parse(event.body);

  const prompt = `你是一位精通博弈论与心理学的社交分析专家。
现有两人在【${category}】维度的测试中出现分歧：
题目：${question}
A的选择：${choiceA}
B的选择：${choiceB}

请通过这两人的选项，深度挖掘他们对“${category}”底层认知的本质差异。
要求：
1. 语气：犀利、毒舌但不失优雅，像顶级脱口秀演员。
2. 逻辑：一针见血，指出这种三观分歧在未来生活（如婚后或长期相处）中可能演变成的具体矛盾场景。
3. 结尾：给出一个极具反差感的调解建议。
4. 字数：控制在80字以内。`;

  // 关键点：在 Base URL 后面必须补上 /chat/completions
    const MI_API_ENDPOINT = "https://token-plan-cn.xiaomimimo.com/v1/chat/completions";

    const response = await fetch(MI_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.XIAOMI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // 使用你权益中的旗舰模型
        model: "mimo-V2.5-Pro", 
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
