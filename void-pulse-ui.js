// ============================================
// AXIOM VOID PULSE UI v2.0
// Con barra animada, conteo progresivo y interactividad
// ============================================

(function() {
    // Elementos del DOM
    const textInput = document.getElementById('textInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const analysisOutput = document.getElementById('analysisOutput');
    const copyResultBtn = document.getElementById('copyResultBtn');
    const enhanceBtn = document.getElementById('enhanceBtn');
    
    // Elementos de estadísticas
    const pulseScoreSpan = document.getElementById('pulseScore');
    const emotionSpan = document.getElementById('emotion');
    const backlashRiskSpan = document.getElementById('backlashRisk');
    const viralityPredictionSpan = document.getElementById('viralityPrediction');
    
    let currentAnalysis = null;
    let currentPulseScore = 0;
    let animationTimer = null;
    
    function getPulseColor(score) {
        if (score >= 70) return '#ff3366';
        if (score >= 45) return '#ffaa00';
        return '#00ff66';
    }
    
    // Crear barra de pulso si no existe
    function ensurePulseBar() {
        let pulseBarContainer = document.getElementById('pulseBarContainer');
        if (!pulseBarContainer && pulseScoreSpan) {
            const parent = pulseScoreSpan.parentElement;
            const barContainer = document.createElement('div');
            barContainer.id = 'pulseBarContainer';
            barContainer.style.cssText = 'margin-top: 8px; width: 100%;';
            barContainer.innerHTML = `
                <div style="background: var(--code-bg); border-radius: 10px; height: 8px; overflow: hidden;">
                    <div id="pulseBarFill" style="width: 0%; height: 100%; background: #00ff66; border-radius: 10px; transition: width 0.3s ease;"></div>
                </div>
            `;
            parent.appendChild(barContainer);
        }
    }
    
    function updatePulseBar(percent) {
        const barFill = document.getElementById('pulseBarFill');
        if (barFill) {
            barFill.style.width = `${percent}%`;
            barFill.style.background = getPulseColor(percent);
        }
    }
    
    // Animación de conteo progresivo
    function animatePulseScore(targetScore, duration = 600) {
        if (animationTimer) clearInterval(animationTimer);
        
        const startScore = currentPulseScore;
        const difference = targetScore - startScore;
        const startTime = performance.now();
        
        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(startScore + (difference * easeOut));
            
            if (pulseScoreSpan) {
                pulseScoreSpan.innerText = current;
                pulseScoreSpan.style.color = getPulseColor(current);
            }
            updatePulseBar(current);
            
            if (progress < 1) {
                animationTimer = setTimeout(() => step(performance.now()), 16);
            } else {
                animationTimer = null;
                currentPulseScore = targetScore;
            }
        }
        
        animationTimer = setTimeout(() => step(performance.now()), 16);
    }
    
    // Animación de oscilación (simula medición)
    function animateMeasuring() {
        let measuringInterval;
        let oscillations = 0;
        
        function oscillate() {
            if (oscillations >= 8) {
                clearInterval(measuringInterval);
                return;
            }
            const fakePercent = 30 + Math.random() * 30;
            if (pulseScoreSpan) {
                pulseScoreSpan.innerText = Math.round(fakePercent);
                pulseScoreSpan.style.opacity = '0.7';
            }
            updatePulseBar(fakePercent);
            oscillations++;
        }
        
        measuringInterval = setInterval(oscillate, 80);
        setTimeout(() => {
            clearInterval(measuringInterval);
            if (pulseScoreSpan) pulseScoreSpan.style.opacity = '1';
        }, 700);
        
        return measuringInterval;
    }
    
    function updateUIWithAnimation(result) {
        // Oscilar mientras se "mide"
        const measuring = animateMeasuring();
        
        // Actualizar emoción y otros datos inmediatos
        if (emotionSpan) {
            emotionSpan.innerText = `${result.emotion.dominant} (${result.emotion.manipulation}% manipulación)`;
        }
        
        let backlashText = result.backlash.level.toUpperCase();
        if (result.backlash.score > 0) backlashText += ` (${result.backlash.score}%)`;
        if (backlashRiskSpan) backlashRiskSpan.innerText = backlashText;
        
        if (viralityPredictionSpan) {
            viralityPredictionSpan.innerText = `${result.virality}%`;
        }
        
        // Actualizar output
        if (analysisOutput) {
            const output = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `📊 PULSE SCORE: midiendo...\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `💭 EMOCIÓN DOMINANTE: ${result.emotion.dominant}\n` +
                `🎭 Manipulación emocional: ${result.emotion.manipulation}%\n\n` +
                `⚠️ RIESGO BACKLASH: ${result.backlash.level.toUpperCase()}\n` +
                `📈 PREDICCIÓN VIRAL: ${result.virality}%\n\n` +
                `💡 RECOMENDACIÓN:\n${result.recommendation}`;
            analysisOutput.innerText = output;
        }
        
        // Animar el Pulse Score después de la oscilación
        setTimeout(() => {
            animatePulseScore(result.pulseScore, 500);
        }, 650);
        
        // Guardar análisis actual
        currentAnalysis = result;
    }
    
    function analyzeText() {
        const text = textInput ? textInput.value : "";
        
        if (!text || text.trim().length === 0) {
            if (analysisOutput) analysisOutput.innerText = "// No hay texto para analizar. Escribe o pega algo primero.";
            return;
        }
        
        const result = VoidPulseCore.analyzeText(text);
        console.log("Resultado:", result);
        updateUIWithAnimation(result);
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
            analysisOutput.innerText = `✨ VERSIÓN POTENCIADA:\n\n${enhanced}\n\n💡 Versión mejorada para más impacto.`;
            analysisOutput.style.borderLeft = "3px solid var(--accent-glow-1)";
            setTimeout(() => { if (analysisOutput) analysisOutput.style.borderLeft = ""; }, 500);
        }
        
        setTimeout(() => {
            const copyEnhanced = confirm("¿Quieres copiar la versión potenciada?");
            if (copyEnhanced) {
                navigator.clipboard.writeText(enhanced);
                alert("¡Texto potenciado copiado!");
            }
        }, 100);
    }
    
    // Conectar eventos
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeText);
    }
    
    if (copyResultBtn) {
        copyResultBtn.addEventListener('click', copyResult);
    }
    
    if (enhanceBtn) {
        enhanceBtn.addEventListener('click', enhanceText);
    }
    
    // Análisis automático mientras se escribe (con debounce)
    let debounceTimer;
    if (textInput) {
        textInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (textInput.value.trim().length > 2) {
                    analyzeText();
                } else if (textInput.value.trim().length === 0) {
                    if (pulseScoreSpan) pulseScoreSpan.innerText = "0";
                    updatePulseBar(0);
                }
            }, 600);
        });
    }
    
    // Tema oscuro/claro
    const themeToggle = document.getElementById('themeToggle');
    const htmlTag = document.documentElement;
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = htmlTag.getAttribute('data-theme') === 'dark';
            htmlTag.setAttribute('data-theme', isDark ? 'light' : 'dark');
            themeToggle.innerText = isDark ? '☀️' : '🌙';
            updatePulseBar(currentPulseScore);
        });
    }
    
    // Inicializar barra y demo
    function init() {
        ensurePulseBar();
        if (textInput && (!textInput.value || textInput.value.trim().length === 0)) {
            const exampleText = `Acabo de descubrir algo que va a cambiar todo. Estoy flipando. 🔥`;
            textInput.value = exampleText;
            analyzeText();
        }
        console.log("🚀 AXIOM VOID PULSE UI v2.0 - Con barra animada");
    }
    
    init();
})();
