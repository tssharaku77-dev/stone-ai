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

    resultArea.innerHTML = '<p class="loading">Gemini 3 系統の周波数をスキャン中...</p>';

    // 2026年現在の Gemini 3 Flash の可能性のあるモデルIDリスト
    const modelCandidates = [
        'gemini-3-flash',
        'gemini-3-flash-v1',
        'gemini-3-flash-001',
        'gemini-2.0-flash' // 予備：3.0環境でも互換性が高い最新版
    ];

    let success = false;
    let lastErrorMessage = "";

    for (const modelId of modelCandidates) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${API_KEY}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: type === 'diag' ? input + "という悩みに合う石を1つ選び、150文字以内で癒やしのアドバイスをして。最後に守護力を星5つで評価して。" : input + "の詳細を教えて。" }] }]
                })
            });

            const data = await response.json();

            if (data.error) {
                lastErrorMessage = data.error.message;
                console.log(`${modelId} は見つかりませんでした: ${lastErrorMessage}`);
                continue; // 次の候補を試す
            }

            if (data.candidates && data.candidates[0].content) {
                // 成功！
                const aiResponse = data.candidates[0].content.parts[0].text;
                resultArea.innerHTML = `
                    <div class="response-text">
                        <small style="color: #aaa;">Connected: ${modelId}</small><br><br>
                        ${aiResponse.replace(/\n/g, '<br>')}
                    </div>`;
                success = true;
                break; 
            }
        } catch (e) {
            lastErrorMessage = e.message;
            continue;
        }
    }

    if (!success) {
        resultArea.innerHTML = `<p class="error-msg">⚠️ 全てのGemini 3系統との共鳴に失敗しました。<br><small>最終エラー: ${lastErrorMessage}</small></p>`;
    }
}
