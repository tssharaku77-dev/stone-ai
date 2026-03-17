// 1. あなたのAPIキーに書き換えてください
const API_KEY = 'AIzaSyCc6r8kofeaN3Y6oalQQNkSZVEXmpTeBRU'; 

async function execute(type) {
    const inputElement = document.getElementById('stoneInput');
    const resultArea = document.getElementById('resultArea');
    
    if (!inputElement || !resultArea) {
        alert("部品が見つかりません。HTMLとJSの接続を確認してください。");
        return;
    }

    const input = inputElement.value.trim();
    if (!input) {
        alert('内容を入力してください。');
        return;
    }

    // 実行されているバージョンを明示します
    resultArea.innerHTML = '<p class="loading">石と共鳴中... (Gemini 3 Flash 接続開始)</p>';

    // 【2026年最新】Gemini 3 Flash を呼び出すための正しいエンドポイント
    // APIバージョンは最新機能に対応した v1beta を使用します
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${API_KEY}`;

    const prompt = type === 'diag' 
        ? `${input}という悩みに対して、最適な天然石を1つ選び、石の精霊として150文字以内で癒やしのメッセージを伝えて。最後に守護力を星5つで評価して。`
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

        // エラー応答のハンドリング
        if (data.error) {
            throw new Error(`${data.error.message} (Code: ${data.error.code})`);
        }

        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            resultArea.innerHTML = `<div class="response-text">${aiResponse.replace(/\n/g, '<br>')}</div>`;
        } else {
            throw new Error("AIからの応答が空です。モデル名を確認してください。");
        }

    } catch (error) {
        console.error("Error Details:", error);
        // エラーの理由を画面に大きく表示
        resultArea.innerHTML = `<p class="error-msg">⚠️ 共鳴失敗<br><small>理由: ${error.message}</small><br><small>実行モデル: gemini-3-flash</small></p>`;
    }
}
