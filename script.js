// 【重要】新しいAPIキーをここに貼る。リポジトリがPrivateであることを確認してください。
const API_KEY = 'AIzaSyC4m9fgXthqurycjY4cf1HSN88_wPj2cGU'; 

async function execute(type) {
    const inputElement = document.getElementById('stoneInput');
    const resultArea = document.getElementById('resultArea');
    if (!inputElement || !resultArea) return;

    const input = inputElement.value.trim();
    if (!input) {
        alert('内容を入力してください。');
        return;
    }

    resultArea.innerHTML = '<p class="loading">Gemini 3 Flash と共鳴中...</p>';

    // 2026年現在の Gemini 3 Flash 正式エンドポイント
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: type === 'diag' ? input + "という悩みに合う石を1つ選び、150文字以内で癒やしのアドバイスをして。最後に守護力を星5つで評価して。" : input + "の詳細を教えて。" }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        if (data.candidates && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            resultArea.innerHTML = `
                <div class="response-text">
                    ${aiResponse.replace(/\n/g, '<br>')}
                </div>`;
        }
    } catch (e) {
        console.error("Error:", e);
        resultArea.innerHTML = `<p class="error-msg">⚠️ 共鳴失敗<br><small>理由: ${e.message}</small></p>`;
    }
}
