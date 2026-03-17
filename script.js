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

    resultArea.innerHTML = '<p class="loading">石と共鳴中...</p>';

    // 【解決策】モデル名を最も汎用的な「gemini-pro」に変更
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: type === 'diag' ? input + "に合う天然石を1つ選び、癒やしのメッセージを100文字で伝えて。最後に守護力を星5つで評価して。" : input + "の石言葉を教えて。" }] }]
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
            throw new Error("応答が空です。");
        }

    } catch (error) {
        console.error("Error:", error);
        resultArea.innerHTML = `<p class="error-msg">⚠️ 共鳴失敗<br><small>理由: ${error.message}</small></p>`;
    }
}
