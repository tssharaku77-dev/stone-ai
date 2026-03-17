// 【重要】gen-lang-client-0236022896 で作った新しいキーに貼り替えてください
const KEY = 'AIzaSyCQGI4FaAFvLpTyI2Em5IGoAm3_02hNAYI'; 

async function execute(type) {
    const resArea = document.getElementById('resultArea');
    const input = document.getElementById('stoneInput').value.trim();
    if (!input) return alert('入力してください');

    resArea.innerHTML = '✨ 石の記憶を呼び起こしています...';

    // 2026年3月現在、新規無料プロジェクトで最も通りやすい最新モデル名
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: input + "について、石の鑑定士として石言葉やアドバイスを150文字以内で答えて。" }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            // エラーが出た場合、その内容を分かりやすく表示
            throw new Error(data.error.message);
        }

        const text = data.candidates[0].content.parts[0].text;
        resArea.innerHTML = `
            <div style="background:rgba(255,255,255,0.1); padding:15px; border-radius:10px; line-height:1.6;">
                ${text.replace(/\n/g, '<br>')}
            </div>
            <div style="font-size:10px; color:#888; margin-top:10px; text-align:right;">Powered by Gemini 1.5 Flash</div>
        `;

    } catch (e) {
        resArea.innerHTML = `
            <div style="color:#ff6b6b; padding:10px; border:1px solid #ff6b6b; border-radius:5px;">
                【鑑定失敗】<br>
                理由: ${e.message}<br><br>
                ※新しいキーを貼り付けた後、GitHubで保存（Commit）し、1分待ってからサイトをリロードしてください。
            </div>
        `;
    }
}
