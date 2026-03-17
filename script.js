// AIzaSyAaQoweIU7lGEy9M5N3V_aZVVQguGp2EZg
const API_KEY = 'YOUR_NEW_API_KEY_HERE'; 

async function execute(type) {
    const input = document.getElementById('stoneInput').value;
    const resultArea = document.getElementById('resultArea');
    
    if (!input) {
        alert('石の名前や、お悩みを入力してくださいね。');
        return;
    }

    resultArea.innerHTML = '<p class="loading">石と共鳴中...</p>';

    // 2026年現在の安定版モデル（gemini-2.0-flash）を使用
    const diagUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const prompt = type === 'diag' 
        ? `あなたは伝説の宝石鑑定士です。悩み「${input}」に対して、癒やしとなる天然石を1つ選び、その石のささやき（アドバイス）を150文字以内で伝えてください。最後にその石の「守護力」を星5つで評価してください。`
        : `天然石「${input}」についての図鑑データを作成してください。【石言葉】【主な産地】【浄化方法】を箇条書きで簡潔に教えてください。`;

    try {
        const response = await fetch(diagUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // 403エラー（制限エラー）などのハンドリング
        if (!response.ok) {
            console.error("APIエラー詳細:", data);
            throw new Error(data.error?.message || '通信エラーが発生しました');
        }

        const aiResponse = data.candidates[0].content.parts[0].text;
        resultArea.innerHTML = `<div class="response-text">${aiResponse.replace(/\n/g, '<br>')}</div>`;

    } catch (error) {
        console.error("エラーログ:", error);
        resultArea.innerHTML = `<p class="error-msg">⚠️ 石との共鳴に失敗しました。<br><small>理由: ${error.message}</small></p>`;
    }
}
