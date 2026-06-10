// ============================================
// AXIOM VOID PULSE CORE v2.0
// Motor de análisis emocional mejorado
// Detecta CUALQUIER texto por reglas de forma + emociones
// 100% local - Sin dependencias externas
// ============================================

const VoidPulseCore = (function() {
    
    // Diccionario de emociones (expandido)
    const EMOTION_KEYWORDS = {
        alegria: ['feliz', 'genial', 'increíble', 'excelente', 'amor', '❤️', '🎉', 'gracias', 'maravilloso', 'contento', 'alegría', 'sonrisa', 'celebrar', 'disfrutar', 'fantástico', 'perfecto', 'felicidad', 'emocionado', '❤️', '😊', '😁', '🥳'],
        ira: ['odio', 'rabia', 'enfadado', 'puta', 'mierda', '💢', '🤬', 'imbécil', 'basura', 'asco', 'indignado', 'furia', 'colérico', 'cabrón', 'joder', 'detesto', 'asqueroso', '😡', '👿'],
        tristeza: ['triste', 'deprimido', 'llorar', '😢', '💔', 'solitario', 'vacío', 'melancolía', 'pena', 'dolor', 'desgracia', 'sufrir', 'lamento', 'fracaso', 'perdí', 'adiós'],
        miedo: ['miedo', 'terror', 'pánico', '😨', '😱', 'alarma', 'peligro', 'amenaza', 'inseguro', 'preocupado', 'ansiedad', 'nervioso', 'susto', 'horror'],
        sorpresa: ['sorpresa', 'impactante', '😲', 'wow', 'impresionante', 'inesperado', 'asombroso', 'increíble', 'vaya', 'oh'],
        confianza: ['seguro', 'confianza', 'fuerte', 'poder', 'dominante', '💪', 'claro', 'decidido', 'firme', 'garantía', 'absolutamente', 'definitivamente']
    };
    
    // Palabras de backlash
    const BACKLASH_KEYWORDS = [
        'polémico', 'controversial', 'odio', 'puta', 'mierda', 'imbécil', 'basura',
        'feminista', 'machista', 'racista', 'fascista', 'comunista', 'nazi',
        'violencia', 'muerte', 'matar', 'asesino', 'crimen', 'corrupto', 'que te jodan'
    ];
    
    // Palabras virales
    const VIRAL_KEYWORDS = [
        '🔥', '💣', '🚀', 'exclusiva', 'nuevo', 'revolucionario', 'nunca antes',
        'descubrimiento', 'impactante', 'rompe récords', 'histórico', 'viral', 'tendencia'
    ];
    
    // Palabras positivas para mejorar versión potenciada
    const POSITIVE_BOOST = ['increíble', 'fantástico', 'espectacular', 'genial', 'maravilloso', 'excelente', 'brutal', 'impresionante'];
    
    // ========== NUEVAS REGLAS DE FORMA ==========
    
    function analyzeForm(text) {
        let formScore = 0;
        let details = [];
        
        const length = text.length;
        const wordCount = text.split(/\s+/).length;
        
        // Longitud
        if (length < 20) {
            formScore -= 10;
            details.push("Texto muy corto");
        } else if (length > 500) {
            formScore -= 15;
            details.push("Texto muy largo");
        } else if (length >= 50 && length <= 200) {
            formScore += 10;
            details.push("Longitud óptima");
        }
        
        // MAYÚSCULAS
        const upperCount = (text.match(/[A-ZÁÉÍÓÚÜ]{3,}/g) || []).length;
        const upperRatio = upperCount * 5;
        if (upperRatio > 20) {
            formScore += Math.min(upperRatio, 25);
            details.push("Uso intensivo de mayúsculas");
        } else if (upperRatio > 5) {
            formScore += upperRatio;
            details.push("Algunas mayúsculas");
        }
        
        // Signos de exclamación
        const exclamCount = (text.match(/!{2,}/g) || []).length;
        if (exclamCount > 0) {
            formScore += exclamCount * 8;
            details.push("Múltiples exclamaciones");
        } else if (text.includes('!')) {
            formScore += 5;
            details.push("Exclamación");
        }
        
        // Signos de interrogación (restan energía)
        const questionCount = (text.match(/\?{2,}/g) || []).length;
        if (questionCount > 0) {
            formScore -= questionCount * 6;
            details.push("Múltiples dudas/interrogaciones");
        }
        
        // Emojis positivos
        const positiveEmojis = (text.match(/[❤️😊🎉🔥👍💪✨🎯🚀🥳😁😍⭐]/g) || []).length;
        formScore += positiveEmojis * 6;
        if (positiveEmojis > 0) details.push(`Emojis positivos x${positiveEmojis}`);
        
        // Emojis negativos
        const negativeEmojis = (text.match(/[💢😡🤬😢💔😨😱👿]/g) || []).length;
        formScore -= negativeEmojis * 8;
        if (negativeEmojis > 0) details.push(`Emojis negativos x${negativeEmojis}`);
        
        return { score: Math.min(Math.max(formScore, -30), 40), details };
    }
    
    function analyzeEmotion(text) {
        const lowerText = text.toLowerCase();
        let scores = {
            alegria: 0,
            ira: 0,
            tristeza: 0,
            miedo: 0,
            sorpresa: 0,
            confianza: 0
        };
        
        for (let [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
            for (let kw of keywords) {
                const regex = new RegExp(kw, 'gi');
                const matches = (lowerText.match(regex) || []).length;
                scores[emotion] += matches * 12;
            }
        }
        
        let maxScore = 0;
        let dominantEmotion = 'neutro';
        
        for (let [emotion, score] of Object.entries(scores)) {
            if (score > maxScore) {
                maxScore = score;
                dominantEmotion = emotion;
            }
        }
        
        // Si no hay emoción dominante clara, se queda neutro
        if (maxScore < 10) dominantEmotion = 'neutro';
        
        // Calcular manipulación (mezcla de emociones)
        let emotionCount = 0;
        for (let score of Object.values(scores)) {
            if (score > 15) emotionCount++;
        }
        const manipulationPercent = Math.min(emotionCount * 12, 80);
        
        return { dominant: dominantEmotion, manipulation: manipulationPercent, scores };
    }
    
    function calculatePulseScore(text, emotionScores, formScore) {
        let score = 45; // Base más alta para que "hola" no sea tan bajo
        
        // Ajuste por emoción dominante
        const emotions = emotionScores.scores;
        if (emotions.alegria > 20) score += 20;
        if (emotions.ira > 20) score += 10;
        if (emotions.tristeza > 20) score -= 25;
        if (emotions.miedo > 20) score -= 15;
        if (emotions.confianza > 20) score += 20;
        if (emotions.sorpresa > 20) score += 15;
        
        // Ajuste por forma
        score += formScore;
        
        // Ajuste por longitud de palabra
        const wordCount = text.split(/\s+/).length;
        if (wordCount === 1 && text.length < 10) {
            score -= 5; // Palabras muy cortas como "hola" bajan un poco
        }
        
        return Math.min(Math.max(Math.round(score), 0), 100);
    }
    
    function calculateBacklashRisk(text) {
        const lowerText = text.toLowerCase();
        let riskScore = 0;
        
        for (let kw of BACKLASH_KEYWORDS) {
            if (lowerText.includes(kw)) riskScore += 18;
        }
        
        const upperCount = (text.match(/[A-Z]{5,}/g) || []).length;
        riskScore += upperCount * 8;
        
        const exclamCount = (text.match(/!{3,}/g) || []).length;
        riskScore += exclamCount * 12;
        
        if (riskScore >= 60) return { level: "alto", score: Math.min(riskScore, 100) };
        if (riskScore >= 30) return { level: "medio", score: riskScore };
        return { level: "bajo", score: riskScore };
    }
    
    function calculateVirality(text) {
        let score = 25;
        
        for (let kw of VIRAL_KEYWORDS) {
            if (text.includes(kw)) score += 18;
        }
        
        const hashtags = (text.match(/#\w+/g) || []).length;
        score += hashtags * 6;
        
        const mentions = (text.match(/@\w+/g) || []).length;
        score += mentions * 4;
        
        if (text.length >= 50 && text.length <= 150) score += 12;
        
        if ((text.match(/[!?]{2,}/g) || []).length > 0) score += 8;
        
        return Math.min(Math.round(score), 100);
    }
    
    function enhanceTextIntelligently(text, emotion, pulseScore) {
        let enhanced = text;
        
        // Limpiar espaciado
        enhanced = enhanced.trim();
        
        // Si es muy corto, expandir
        if (enhanced.length < 30 && !enhanced.includes('?')) {
            if (emotion.dominant === 'alegria' || pulseScore > 60) {
                enhanced = enhanced + " ¡Qué emoción! 🎉";
            } else if (emotion.dominant === 'tristeza') {
                enhanced = enhanced + " Ánimo, las cosas mejoran. 💪";
            } else if (emotion.dominant === 'ira') {
                enhanced = enhanced + " Tranquilo, vamos a resolverlo. 🧘";
            } else {
                enhanced = enhanced + " ¿Qué opinas? 👀";
            }
        }
        
        // Capitalizar primera letra
        if (enhanced[0]) {
            enhanced = enhanced[0].toUpperCase() + enhanced.slice(1);
        }
        
        // Añadir punto final si no tiene
        if (!enhanced.match(/[.!?]$/)) {
            enhanced = enhanced + ".";
        }
        
        // Si tiene emoción positiva y poca energía, añadir emoji
        const emojiCount = (enhanced.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
        if (emojiCount === 0 && (emotion.dominant === 'alegria' || pulseScore > 65)) {
            enhanced = enhanced + " 🔥";
        }
        
        return enhanced;
    }
    
    function analyzeText(text) {
        if (!text || text.trim().length === 0) {
            return {
                pulseScore: 0,
                emotion: { dominant: "—", manipulation: 0 },
                backlash: { level: "bajo", score: 0 },
                virality: 0,
                enhancedText: "",
                recommendation: "Escribe o pega un texto para analizar."
            };
        }
        
        const emotionResults = analyzeEmotion(text);
        const formAnalysis = analyzeForm(text);
        const pulseScore = calculatePulseScore(text, emotionResults, formAnalysis.score);
        const backlash = calculateBacklashRisk(text);
        const virality = calculateVirality(text);
        const enhancedText = enhanceTextIntelligently(text, emotionResults, pulseScore);
        
        let recommendation = "";
        if (pulseScore >= 75) recommendation = "🔥 Pulso altísimo. Ideal para contenido viral o llamativo.";
        else if (pulseScore >= 55) recommendation = "📈 Pulso bueno. El texto tiene energía positiva.";
        else if (pulseScore >= 35) recommendation = "😐 Pulso neutral. Puedes darle más fuerza.";
        else recommendation = "💤 Pulso bajo. El texto es plano o negativo. Revísalo.";
        
        if (backlash.level === "alto") recommendation += " ⚠️ ALTO RIESGO de backlash. Ten cuidado.";
        
        let emotionDisplay = emotionResults.dominant;
        if (emotionDisplay === 'neutro') emotionDisplay = 'Neutro';
        else emotionDisplay = emotionDisplay.charAt(0).toUpperCase() + emotionDisplay.slice(1);
        
        return {
            pulseScore: pulseScore,
            emotion: {
                dominant: emotionDisplay,
                manipulation: emotionResults.manipulation
            },
            backlash: backlash,
            virality: virality,
            enhancedText: enhancedText,
            recommendation: recommendation,
            formDetails: formAnalysis.details
        };
    }
    
    return { analyzeText };
})();

window.VoidPulseCore = VoidPulseCore;
