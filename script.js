const API_KEY = 'AIzaSyAaQoweIU7lGEy9M5N3V_aZVVQguGp2EZg'; 

async function execute(type) {
    const input = document.getElementById('stoneInput').value;
    const resultArea = document.getElementById('resultArea');
    
    if (!input) {
        alert('石の名前や、お悩みを入力してください。');
        return;
    }

    resultArea.innerHTML = '<p class="loading">石と共鳴中...</p>';

    // 2026年現在、最も安定しているエンドポイント
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const prompt = type === 'diag' 
        ? `${input}という悩みに対して、癒やしとなる天然石を1つ選び、石の精霊として150文字以内でアドバイスして。最後に守護力を星5つで評価して。`
        : `天然石「${input}」の【石言葉】【主な産地】【浄化方法】を簡潔に教えて。`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // ここがエラー対策：データがあるか厳重にチェックします
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            resultArea.innerHTML = `<div class="response-text">${aiResponse.replace(/\n/g, '<br>')}</div>`;
        } else {
            // AIからの返答が空だった場合
            console.error("AIからの返答が空です:", data);
            throw new Error(data.error?.message || "AIが回答を拒否しました（安全フィルターなど）");
        }

    } catch (error) {
        console.error("エラー詳細:", error);
        resultArea.innerHTML = `<p class="error-msg">⚠️ 共鳴失敗<br><small>理由: ${error.message}</small></p>`;
    }
}
