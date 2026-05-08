exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { category, question, choiceA, choiceB } = JSON.parse(event.body);

        // 获取当前日期（符合小米要求的系统提示词格式）
        const now = new Date();
        const dateStr = now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
        const weekStr = now.toLocaleDateString('zh-CN', { weekday: 'long' });

        // 小米官方建议的系统提示词
        const systemContent = `你是MiMo（中文名称也是MiMo），是小米公司研发的AI智能助手。今天的日期：${dateStr} ${weekStr}，你的知识截止日期是2024年12月。你现在是一位精通心理学的情感分析专家，负责犀利地点评情侣分歧。`;

        const userPrompt = `两人在【${category}】维度的测试出现分歧：
题目：${question}
A选择：${choiceA}
B选择：${choiceB}
请用一段60字以内、幽默犀利的脱口秀风格话语，指出两人的本质矛盾并给出一个反差感建议。`;

        // 根据文档修正域名：优先尝试 api.xiaomimimo.com
        // 如果依然不行，再换回 token-plan-cn.xiaomimimo.com
        const MI_ENDPOINT = "https://token-plan-cn.xiaomimimo.com/v1/chat/completions";

        const response = await fetch(MI_ENDPOINT, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.XIAOMI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "mimo-v2.5-pro", // 严格遵守文档的小写格式
                messages: [
                    { "role": "system", "content": systemContent },
                    { "role": "user", "content": userPrompt }
                ],
                temperature: 1.0, // 遵照文档建议的默认值
                top_p: 0.95
            })
        });

        const data = await response.json();

        // 增加容错检查
        if (data.choices && data.choices[0]) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ result: data.choices[0].message.content })
            };
        } else {
            console.error("小米返回原始数据:", JSON.stringify(data));
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "模型返回异常", detail: data })
            };
        }

    } catch (error) {
        console.error("捕获异常:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "网络请求失败", message: error.message })
        };
    }
};
