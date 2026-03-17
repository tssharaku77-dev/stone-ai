const API_KEY = 'AIzaSyAaQoweIU7lGEy9M5N3V_aZVVQguGp2EZg'; 

async function execute(type) {
    const inputElement = document.getElementById('stoneInput');
    const resultArea = document.getElementById('resultArea');
    
    if (!inputElement || !resultArea) {
        alert("システムエラー：画面の部品が見つかりません。");
        return;
    }

    const input = inputElement.value;
    if (!input) {
        alert('内容を入力してください。');
        return;
    }

    resultArea.innerHTML = '<p class="loading">石と共鳴中...</p>';

    // 【修正ポイント】2026年現在の最新安定モデル gemini-2.0-flash を指定
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const prompt = type === 'diag' 
        ? `${input}という悩みに対して、癒やしとなる天然石を1つ選び、石の精霊として150文字以内でアドバイスして。最後にその石の「守護力」を星5つで評価して。`
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

        // データの存在を厳重にチェック
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            resultArea.innerHTML = `<div class="response-text">${aiResponse.replace(/\n/g, '<br>')}</div>`;
        } else {
            // エラー内容が返ってきた場合に、より詳細を表示するように強化
            const errorMsg = data.error ? data.error.message : "AIからの返答が空です。";
            throw new Error(errorMsg);
        }

    } catch (error) {
        console.error("Error:", error);
        resultArea.innerHTML = `<p class="error-msg">⚠️ 共鳴失敗<br><small>理由: ${error.message}</small></p>`;
    }
}
