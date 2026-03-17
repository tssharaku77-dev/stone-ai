// 【重要】警告が消えた新しいキーをここに貼ってください
const KEY = 'AIzaSyCQGI4FaAFvLpTyI2Em5IGoAm3_02hNAYI'; 

async function execute(type) {
    const resArea = document.getElementById('resultArea');
    const input = document.getElementById('stoneInput').value.trim();
    if (!input) return alert('入力してください');

    resArea.innerHTML = '✨ 接続可能な石の精霊を探索中...';

    // 2026年3月現在、動く可能性のある全パターンを優先順に定義
    const attempts = [
        { ver: 'v1', model: 'gemini-1.5-flash' },
        { ver: 'v1beta', model: 'gemini-1.5-flash' },
        { ver: 'v1', model: 'gemini-pro' },
        { ver: 'v1beta', model: 'gemini-pro' }
    ];

    let success = false;

    for (const attempt of attempts) {
        const url = `https://generativelanguage.googleapis.com/${attempt.ver}/models/${attempt.model}:generateContent?key=${KEY}`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: input + "について、石の視点から短く鑑定して。" }] }]
                })
            });

            const data = await response.json();

            if (data.candidates && data.candidates[0].content) {
                const text = data.candidates[0].content.parts[0].text;
                resArea.innerHTML = `
                    <div style="font-size:10px; color:#888;">接続成功: ${attempt.model} (${attempt.ver})</div>
                    <div style="margin-top:10px; line-height:1.6;">${text.replace(/\n/g, '<br>')}</div>
                `;
                success = true;
                break; // 成功したのでループ終了
            } else {
                console.log(`${attempt.model} (${attempt.ver}) は失敗: ${data.error?.message}`);
            }
        } catch (e) {
            console.log(`${attempt.model} 通信エラー`);
        }
    }

    if (!success) {
        resArea.innerHTML = `
            <div style="color:#ff6b6b; border:1px solid red; padding:10px;">
                【全モデル接続失敗】<br>
                原因：Google側でキーがまだ「完全に有効」になっていません。<br><br>
                対策：AI Studioで新しいキーを作り直すか、5分待ってから Ctrl+F5 を押してください。
            </div>
        `;
    }
}
