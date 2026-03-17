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

    resultArea.innerHTML = '<p class="loading">Gemini 3 と共鳴中...</p>';

    // 【2026年最新】Gemini 3系統の呼び出し候補
    const models = ['gemini-3-flash', 'gemini-3-flash-v1', 'gemini-3'];
    let lastError = "";

    // 使えるモデルが見つかるまでループします
    for (const modelName of models) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: type === 'diag' ? input + "という悩みに合う石を教えて。最後に守護力を星5つで評価して。" : input + "の石言葉を教えて。" }] }]
                })
            });

            const data = await response.json();

            if (data.error) {
                lastError = data.error.message;
                continue; // 次のモデル名を試す
            }

            if (data.candidates && data.candidates[0].content) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                resultArea.innerHTML = `<div class="response-text"><strong>(Model: ${modelName})</strong><br>${aiResponse.replace(/\n/g, '<br>')}</div>`;
                return; // 成功したら終了
            }
        } catch (e) {
            lastError = e.message;
        }
    }

    // すべての候補がダメだった場合
    resultArea.innerHTML = `<p class="error-msg">⚠️ 共鳴失敗<br><small>理由: ${lastError}</small></p>`;
}
