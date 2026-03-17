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

    // 【これが2026年最新の正解URLです】
    // v1beta を使い、モデル名は gemini-1.5-flash で指定
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const prompt = type === 'diag' 
        ? `${input}という悩みに対して、癒やしとなる天然石を1つ選び、石の精霊として150文字以内でアドバイスしてください。最後に守護力を星5つ（★★★★★）で評価してください。`
        : `天然石「${input}」の【石言葉】【主な産地】【浄化方法】を箇条書きで分かりやすく教えて。`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // エラーの詳細を画面に出す
        if (data.error) {
            throw new Error(data.error.message);
        }

        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            resultArea.innerHTML = `<div class="response-text">${aiResponse.replace(/\n/g, '<br>')}</div>`;
        } else {
            throw new Error("AIが一時的に混み合っています。");
        }

    } catch (error) {
        console.error("Error:", error);
        resultArea.innerHTML = `<p class="error-msg">⚠️ 共鳴失敗<br><small>理由: ${error.message}</small></p>`;
    }
}
