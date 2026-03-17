const KEY = 'AIzaSyB9CTvRXoRARF-DC7Dy5RBi616H5zJfGgc'; 

async function execute(type) {
    const resArea = document.getElementById('resultArea');
    const input = document.getElementById('stoneInput').value.trim();
    if (!input) return alert('入力してください。');

    resArea.innerHTML = '✨ 石の記憶を読み込んでいます...';

    // 2026年最新：v1betaモデルで、最新のGemini 1.5 Flashを指定
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: type === 'diag' 
                            ? `${input}という悩みに対し、癒やしの石を1つ選んで150文字以内でアドバイスして。` 
                            : `${input}の石言葉と浄化方法を教えて。`
                    }]
                }]
            })
        });

        const data = await response.json();

        // もしGoogleからエラーが返ってきた場合、その理由を表示する
        if (data.error) {
            console.error(data.error);
            resArea.innerHTML = `Google APIエラー: ${data.error.message}`;
            return;
        }

        const text = data.candidates[0].content.parts[0].text;
        resArea.innerHTML = `<div style="line-height:1.8;">${text.replace(/\n/g, '<br>')}</div>`;

    } catch (e) {
        // 通信自体が失敗した場合
        resArea.innerHTML = `通信エラーが発生しました。時間を置いて試してください。`;
    }
}
