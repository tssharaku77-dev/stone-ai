const API_KEY = 'AIzaSyCc6r8kofeaN3Y6oalQQNkSZVEXmpTeBRU'; 

async function execute(type) {
    const inputElement = document.getElementById('stoneInput');
    const resultArea = document.getElementById('resultArea');
    if (!inputElement || !resultArea) return;

    const input = inputElement.value.trim();
    if (!input) {
        alert('内容を入力してください。');
        return;
    }

    resultArea.innerHTML = '<p class="loading">石と共鳴中... (Gemini 3.0 Flash接続)</p>';

    // 【2026年最新】Gemini 3.0 Flash専用のエンドポイント
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${API_KEY}`;

    const prompt = type === 'diag' 
        ? `${input}という悩みに合う天然石を1つ選び、150文字以内で癒やしのアドバイスをして。最後に守護力を星5つで評価して。`
        : `天然石「${input}」の【石言葉】【主な産地】【浄化方法】を教えて。`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        if (data.candidates && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            resultArea.innerHTML = `<div class="response-text">${aiResponse.replace(/\n/g, '<br>')}</div>`;
        } else {
            throw new Error("応答データが空です。モデル設定を確認してください。");
        }

    } catch (error) {
        console.error("Error:", error);
        resultArea.innerHTML = `<p class="error-msg">⚠️ 共鳴失敗<br><small>理由: ${error.message}</small></p>`;
    }
}
