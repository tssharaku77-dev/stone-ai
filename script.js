const KEY = 'AIzaSyCQGI4FaAFvLpTyI2Em5IGoAm3_02hNAYI'; // ...2896のプロジェクトで作ったキー

async function execute(type) {
    const resArea = document.getElementById('resultArea');
    const input = document.getElementById('stoneInput').value.trim();
    if (!input) return alert('入力してください');

    resArea.innerHTML = '✨ 接続可能なモデルを自動選別中...';

    try {
        // 1. あなたのキーで「今すぐ使えるモデル」のリストを直接取得する
        const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${KEY}`;
        const listRes = await fetch(listUrl);
        const listData = await listRes.json();

        if (!listData.models || listData.models.length === 0) {
            throw new Error("利用可能なモデルがリストにありません。APIの有効化を再確認してください。");
        }

        // 2. リストの中から「generateContent」ができるモデルを自動で見つける
        // 1.5 flash, 1.5 pro, 1.0 pro など、どれでも動くものを優先
        const target = listData.models.find(m => 
            m.supportedGenerationMethods.includes('generateContent') && 
            (m.name.includes('flash') || m.name.includes('pro'))
        );

        if (!target) throw new Error("鑑定に使えるモデルが見つかりませんでした。");

        const modelName = target.name; // 例: models/gemini-1.5-flash-8b
        resArea.innerHTML = `✨ ${modelName} で鑑定を開始します...`;

        // 3. 発掘したモデル名を使って鑑定を実行
        const runUrl = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${KEY}`;
        const runRes = await fetch(runUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: input + "について、石言葉と癒やしのアドバイスを100文字で教えて。" }] }]
            })
        });

        const runData = await runRes.json();
        const text = runData.candidates[0].content.parts[0].text;
        
        resArea.innerHTML = `
            <div style="font-size:10px; color:#888;">使用モデル: ${modelName}</div>
            <div style="margin-top:10px; line-height:1.6;">${text.replace(/\n/g, '<br>')}</div>
        `;

    } catch (e) {
        resArea.innerHTML = `
            <div style="color:#ff6b6b; border:1px solid red; padding:10px;">
                【最終エラー】${e.message}<br><br>
                ※もし「モデルがない」と出るなら、Google Cloud ConsoleでAPIの有効化が反映されるまであと5分待ってください。
            </div>
        `;
    }
}
