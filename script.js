// バージョン確認用（画面に表示されます）
const VERSION = "2026-03-17-FINAL";
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

    // 今のプログラムが最新か確認するためにバージョンを表示
    resultArea.innerHTML = `<p class="loading">石と共鳴中... (Ver: ${VERSION})</p>`;

    // 【完全修正】APIキーの種類を問わず最も安定する v1beta を使用
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: type === 'diag' ? input + "に合う石を教えて。最後に守護力を星5つで評価して。" : input + "の詳細を教えて。" }] }]
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
            throw new Error("AIからの応答が空です。");
        }

    } catch (error) {
        console.error("Error:", error);
        // エラー理由をより詳細に表示
        resultArea.innerHTML = `<p class="error-msg">⚠️ 共鳴失敗<br><small>理由: ${error.message}</small><br><small>URL: v1beta/gemini-1.5-flash</small></p>`;
    }
}
