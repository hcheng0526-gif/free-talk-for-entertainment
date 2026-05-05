const axios = require('axios');

exports.handler = async (event, context) => {
  // 只响应 POST 请求
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { category, question, choiceA, choiceB } = JSON.parse(event.body);

    const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "你是一个犀利幽默的情感教练。请分析两人的三观分歧，用一句话指出本质矛盾并给个好玩的建议。50字以内。"
        },
        {
          role: "user",
          content: `分歧点：在【${category}】方面，题目是“${question}”，A选了“${choiceA}”，B选了“${choiceB}”。`
        }
      ],
      temperature: 0.8
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result: response.data.choices[0].message.content })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AI 思考过度，宕机了" })
    };
  }
};
