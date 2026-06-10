// ============================================
// AXIOM VOID PULSE UI v1.1 - CORREGIDO
// Gestión de eventos, interfaz y actualizaciones
// ============================================

(function() {
    // Elementos del DOM
    const textInput = document.getElementById('textInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const analysisOutput = document.getElementById('analysisOutput');
    const copyResultBtn = document.getElementById('copyResultBtn');
    const enhanceBtn = document.getElementById('enhanceBtn');
    
    // Elementos de estadísticas (los que están en la parte de abajo)
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
        console.log("Actualizando UI con:", result);
        
        // Actualizar estadísticas en la parte de abajo
        if (pulseScoreSpan) {
            pulseScoreSpan.innerText = result.pulseScore;
            pulseScoreSpan.style.color = getPulseColor(result.pulseScore);
        }
        
        if (emotionSpan) {
            emotionSpan.innerText = `${result.emotion.dominant} (${result.emotion.manipulation}% manipulación)`;
        }
        
        let backlashText = result.backlash.level.toUpperCase();
        if (result.backlash.score > 0) backlashText += ` (${result.backlash.score}%)`;
        if (backlashRiskSpan) backlashRiskSpan.innerText = backlashText;
        
        if (viralityPredictionSpan) {
            viralityPredictionSpan.innerText = `${result.virality}%`;
        }
        
        // Actualizar el área de output (PULSO DEL TEXTO)
        if (analysisOutput) {
            const output = `📊 PULSE SCORE: ${result.pulseScore}/100\n\n` +
                `💭 EMOCIÓN DOMINANTE: ${result.emotion.dominant}\n` +
                `🎭 Manipulación emocional: ${result.emotion.manipulation}%\n\n` +
                `⚠️ RIESGO BACKLASH: ${result.backlash.level.toUpperCase()}\n` +
                `📈 PREDICCIÓN VIRAL: ${result.virality}%\n\n` +
                `💡 RECOMENDACIÓN:\n${result.recommendation}`;
            analysisOutput.innerText = output;
        }
    }
    
    function analyzeText() {
        const text = textInput ? textInput.value : "";
        console.log("Analizando texto:", text);
        
        if (!text || text.trim().length === 0) {
            if (analysisOutput) analysisOutput.innerText = "// No hay texto para analizar. Escribe o pega algo primero.";
            return;
        }
        
        const result = VoidPulseCore.analyzeText(text);
        console.log("Resultado del análisis:", result);
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
        if (copyResultBtn) {
            copyResultBtn.innerText = "✓ Copiado!";
            setTimeout(() => { if (copyResultBtn) copyResultBtn.innerText = "📋 Copiar resultado"; }, 2000);
        }
    }
    
    function enhanceText() {
        if (!currentAnalysis || !textInput || !textInput.value.trim()) {
            alert("Primero analiza un texto.");
            return;
        }
        
        const enhanced = currentAnalysis.enhancedText;
        if (analysisOutput) {
            analysisOutput.innerText = `✨ VERSIÓN POTENCIADA:\n\n${enhanced}\n\n💡 Puedes copiar este texto y probar el impacto.`;
            analysisOutput.style.borderLeft = "3px solid var(--accent-glow-1)";
            setTimeout(() => { if (analysisOutput) analysisOutput.style.borderLeft = ""; }, 500);
        }
        
        // Preguntar si quiere copiar
        setTimeout(() => {
            const copyEnhanced = confirm("¿Quieres copiar la versión potenciada al portapapeles?");
            if (copyEnhanced) {
                navigator.clipboard.writeText(enhanced);
                alert("¡Texto potenciado copiado!");
            }
        }, 100);
    }
    
    // Conectar eventos
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeText);
        console.log("✅ Botón 'Medir pulso' conectado");
    }
    
    if (copyResultBtn) {
        copyResultBtn.addEventListener('click', copyResult);
        console.log("✅ Botón 'Copiar resultado' conectado");
    }
    
    if (enhanceBtn) {
        enhanceBtn.addEventListener('click', enhanceText);
        console.log("✅ Botón 'Versión potenciada' conectado");
    }
    
    // Análisis automático mientras se escribe
    let debounceTimer;
    if (textInput) {
        textInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (textInput.value.trim().length > 5) {
                    analyzeText();
                }
            }, 800);
        });
        console.log("✅ Evento 'input' conectado");
    }
    
    // Tema oscuro/claro
    const themeToggle = document.getElementById('themeToggle');
    const htmlTag = document.documentElement;
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = htmlTag.getAttribute('data-theme') === 'dark';
            htmlTag.setAttribute('data-theme', isDark ? 'light' : 'dark');
            themeToggle.innerText = isDark ? '☀️' : '🌙';
        });
    }
    
    // Inicializar con un ejemplo
    function initDemo() {
        if (textInput && (!textInput.value || textInput.value.trim().length === 0)) {
            const exampleText = `Acabo de descubrir algo que va a cambiar todo. Estoy flipando. 🔥 Este es el momento. ¿Alguien más lo está viendo?`;
            textInput.value = exampleText;
            analyzeText();
        }
    }
    
    initDemo();
    console.log("🚀 AXIOM VOID PULSE UI - Inicializado");
})();
