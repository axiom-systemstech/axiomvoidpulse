// ============================================
// AXIOM VOID PULSE UI v1.0
// Gestión de eventos, interfaz y actualizaciones
// ============================================

(function() {
    const textInput = document.getElementById('textInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const analysisOutput = document.getElementById('analysisOutput');
    const copyResultBtn = document.getElementById('copyResultBtn');
    const enhanceBtn = document.getElementById('enhanceBtn');
    
    const pulseScoreSpan = document.getElementById('pulseScore');
    const emotionSpan = document.getElementById('emotion');
    const backlashRiskSpan = document.getElementById('backlashRisk');
    const viralityPredictionSpan = document.getElementById('viralityPrediction');
    
    let currentAnalysis = null;
    
    function getPulseColor(score) {
        if (score >= 70) return '#ff3366';
        if (score >= 40) return '#ffaa00';
        return '#00ff66';
    }
    
    function updateUI(result) {
        // Actualizar estadísticas
        pulseScoreSpan.innerText = result.pulseScore;
        emotionSpan.innerText = `${result.emotion.dominant} (${result.emotion.manipulation}% manipulación)`;
        
        let backlashText = result.backlash.level.toUpperCase();
        if (result.backlash.score > 0) backlashText += ` (${result.backlash.score}%)`;
        backlashRiskSpan.innerText = backlashText;
        viralityPredictionSpan.innerText = `${result.virality}%`;
        
        // Cambiar color del pulse score
        pulseScoreSpan.style.color = getPulseColor(result.pulseScore);
        
        // Barra de pulso en el output
        const pulseBar = `<div class="pulse-bar"><div class="pulse-fill" style="width: ${result.pulseScore}%; background: ${getPulseColor(result.pulseScore)};"></div></div>`;
        
        const output = `${pulseBar}\n\n📊 PULSE SCORE: ${result.pulseScore}/100\n\n` +
            `💭 EMOCIÓN DOMINANTE: ${result.emotion.dominant}\n` +
            `🎭 Manipulación emocional: ${result.emotion.manipulation}%\n\n` +
            `⚠️ RIESGO BACKLASH: ${result.backlash.level.toUpperCase()}\n` +
            `📈 PREDICCIÓN VIRAL: ${result.virality}%\n\n` +
            `💡 RECOMENDACIÓN:\n${result.recommendation}`;
        
        analysisOutput.innerText = output;
        analysisOutput.style.borderLeft = `3px solid ${getPulseColor(result.pulseScore)}`;
        setTimeout(() => { analysisOutput.style.borderLeft = ""; }, 500);
    }
    
    function analyzeText() {
        const text = textInput.value;
        if (!text.trim()) {
            analysisOutput.innerText = "// No hay texto para analizar. Escribe o pega algo primero.";
            return;
        }
        
        const result = VoidPulseCore.analyzeText(text);
        currentAnalysis = result;
        updateUI(result);
    }
    
    function copyResult() {
        if (!currentAnalysis) {
            alert("Primero analiza un texto.");
            return;
        }
        
        const output = `💓 AXIOM VOID PULSE - Resultado del análisis\n\n` +
            `Pulse Score: ${currentAnalysis.pulseScore}/100\n` +
            `Emoción: ${currentAnalysis.emotion.dominant}\n` +
            `Manipulación emocional: ${currentAnalysis.emotion.manipulation}%\n` +
            `Riesgo backlash: ${currentAnalysis.backlash.level.toUpperCase()}\n` +
            `Predicción viral: ${currentAnalysis.virality}%\n\n` +
            `Recomendación: ${currentAnalysis.recommendation}`;
        
        navigator.clipboard.writeText(output);
        copyResultBtn.innerText = "✓ Copiado!";
        setTimeout(() => { copyResultBtn.innerText = "📋 Copiar resultado"; }, 2000);
    }
    
    function enhanceText() {
        if (!currentAnalysis || !textInput.value.trim()) {
            alert("Primero analiza un texto.");
            return;
        }
        
        const enhanced = currentAnalysis.enhancedText;
        analysisOutput.innerText = `✨ VERSIÓN POTENCIADA:\n\n${enhanced}\n\n💡 Puedes copiar este texto y probar el impacto.`;
        analysisOutput.style.borderLeft = "3px solid var(--accent-glow-1)";
        
        // Opción de copiar la versión potenciada
        const copyEnhanced = confirm("¿Quieres copiar la versión potenciada al portapapeles?");
        if (copyEnhanced) {
            navigator.clipboard.writeText(enhanced);
            alert("¡Texto potenciado copiado!");
        }
        
        setTimeout(() => { analysisOutput.style.borderLeft = ""; }, 500);
    }
    
    analyzeBtn.addEventListener('click', analyzeText);
    copyResultBtn.addEventListener('click', copyResult);
    enhanceBtn.addEventListener('click', enhanceText);
    
    let debounceTimer;
    textInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (textInput.value.trim().length > 10) analyzeText();
        }, 800);
    });
    
    const themeToggle = document.getElementById('themeToggle');
    const htmlTag = document.documentElement;
    themeToggle.addEventListener('click', () => {
        const isDark = htmlTag.getAttribute('data-theme') === 'dark';
        htmlTag.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeToggle.innerText = isDark ? '☀️' : '🌙';
    });
    
    function initDemo() {
        const exampleText = `Acabo de descubrir algo que va a cambiar todo. Estoy flipando. 🔥 Este es el momento. ¿Alguien más lo está viendo?`;
        textInput.value = exampleText;
        analyzeText();
    }
    
    if (!textInput.value.trim()) initDemo();
})();