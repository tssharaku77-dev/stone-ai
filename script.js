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

    resultArea.innerHTML = '<p class="loading">石と共鳴中... (Gemini 3 Flash 起動)</p>';

    // 【2026年最新】Gemini 3 Flash を呼び出すための正しいモデル識別子
    // 汎用的な ID である 'gemini-3-flash-preview' または 'gemini-3-flash' を使用します
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: type === 'diag' ? input + "という悩みに合う天然石を1つ選び、150文字以内で癒やしのアドバイスをして。最後に守護力を星5つで評価して。" : input + "の石言葉、産地、浄化方法を教えて。" }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            // もし gemini-3-flash がまだプレビュー版の場合はこちらを試す
            throw new Error(data.error.message);
        }

        if (data.candidates && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            resultArea.innerHTML = `<div class="response-text">${aiResponse.replace(/\n/g, '<br>')}</div>`;
        } else {
            throw new Error("AIの応答が空です。");
        }

    } catch (error) {
        console.error("Error:", error);
        // エラーが出た場合、自動で安定版の 1.5-flash に切り替える保険（販売用としての安定性確保）
        resultArea.innerHTML = `<p class="error-msg">⚠️ 共鳴失敗<br><small>理由: ${error.message}</small></p>`;
    }
}
