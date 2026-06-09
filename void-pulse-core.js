// ============================================
// AXIOM VOID PULSE CORE v1.0
// Motor de análisis emocional y de riesgo
// 100% local - Sin dependencias externas
// ============================================

const VoidPulseCore = (function() {
    
    // Diccionario de emociones y palabras clave
    const EMOTION_KEYWORDS = {
        alegria: ['feliz', 'genial', 'increíble', 'excelente', 'amor', '❤️', '🎉', 'gracias', 'maravilloso', 'contento', 'alegría', 'sonrisa', 'celebrar'],
        ira: ['odio', 'rabia', 'enfadado', 'puta', 'mierda', '💢', '🤬', 'imbécil', 'basura', 'asco', 'indignado', 'furia', 'colérico'],
        tristeza: ['triste', 'deprimido', 'llorar', '😢', '💔', 'solitario', 'vacío', 'melancolía', 'pena', 'dolor', 'desgracia'],
        miedo: ['miedo', 'terror', 'pánico', '😨', '😱', 'alarma', 'peligro', 'amenaza', 'inseguro', 'preocupado', 'ansiedad'],
        sorpresa: ['sorpresa', 'impactante', '😲', 'increíble', 'wow', '😱', 'impresionante', 'inesperado', 'asombroso'],
        confianza: ['seguro', 'confianza', 'fuerte', 'poder', 'dominante', '💪', 'claro', 'decidido', 'firme', 'garantía']
    };
    
    // Palabras de alto riesgo para backlash
    const BACKLASH_KEYWORDS = [
        'polémico', 'controversial', 'odio', 'puta', 'mierda', 'imbécil', 'basura',
        'feminista', 'machista', 'racista', 'fascista', 'comunista', 'nazi',
        'violencia', 'muerte', 'matar', 'asesino', 'crimen', 'corrupto'
    ];
    
    // Palabras para predicción viral
    const VIRAL_KEYWORDS = [
        '🔥', '💣', '🚀', 'exclusiva', 'nuevo', 'revolucionario', 'nunca antes',
        'descubrimiento', 'impactante', 'rompe récords', 'histórico'
    ];
    
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
                scores[emotion] += matches * 10;
            }
        }
        
        // Normalizar a máximo 100
        let maxScore = 0;
        let dominantEmotion = 'neutro';
        
        for (let [emotion, score] of Object.entries(scores)) {
            if (score > maxScore) {
                maxScore = score;
                dominantEmotion = emotion;
            }
        }
        
        // Calcular manipulación emocional (cantidad de emociones mezcladas)
        let emotionCount = 0;
        for (let score of Object.values(scores)) {
            if (score > 10) emotionCount++;
        }
        const manipulationPercent = Math.min(emotionCount * 12, 80);
        
        return { dominant: dominantEmotion, manipulation: manipulationPercent, scores };
    }
    
    function calculatePulseScore(text, emotionScores) {
        let score = 50; // Base neutra
        
        // Ajustar según emoción dominante
        const emotions = emotionScores.scores;
        if (emotions.alegria > 30) score += 20;
        if (emotions.ira > 30) score += 15;
        if (emotions.tristeza > 30) score -= 20;
        if (emotions.miedo > 30) score -= 15;
        if (emotions.confianza > 30) score += 25;
        
        // Longitud del texto
        const wordCount = text.split(/\s+/).length;
        if (wordCount < 10) score -= 10;
        if (wordCount > 200) score -= 5;
        
        // Emojis positivos/negativos
        const positiveEmojis = (text.match(/[❤️😊🎉🔥👍💪✨🎯🚀]/g) || []).length;
        const negativeEmojis = (text.match(/[💢😡🤬😢💔😨😱]/g) || []).length;
        score += positiveEmojis * 5;
        score -= negativeEmojis * 8;
        
        return Math.min(Math.max(Math.round(score), 0), 100);
    }
    
    function calculateBacklashRisk(text) {
        const lowerText = text.toLowerCase();
        let riskScore = 0;
        
        for (let kw of BACKLASH_KEYWORDS) {
            if (lowerText.includes(kw)) riskScore += 15;
        }
        
        // Detectar mayúsculas excesivas
        const upperCount = (text.match(/[A-Z]{3,}/g) || []).length;
        riskScore += upperCount * 5;
        
        // Detectar signos de exclamación excesivos
        const exclamCount = (text.match(/!{2,}/g) || []).length;
        riskScore += exclamCount * 10;
        
        if (riskScore >= 50) return { level: "alto", score: Math.min(riskScore, 100) };
        if (riskScore >= 25) return { level: "medio", score: riskScore };
        return { level: "bajo", score: riskScore };
    }
    
    function calculateVirality(text) {
        const lowerText = text.toLowerCase();
        let score = 20; // Base
        
        for (let kw of VIRAL_KEYWORDS) {
            if (lowerText.includes(kw)) score += 15;
        }
        
        // Tiene hashtags
        const hashtags = (text.match(/#\w+/g) || []).length;
        score += hashtags * 5;
        
        // Tiene menciones
        const mentions = (text.match(/@\w+/g) || []).length;
        score += mentions * 3;
        
        // Longitud óptima para viralidad (50-150 caracteres)
        if (text.length >= 50 && text.length <= 150) score += 10;
        
        return Math.min(Math.round(score), 100);
    }
    
    function enhanceText(text) {
        let enhanced = text;
        
        // Añadir emojis si no tiene muchos
        const emojiCount = (text.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
        if (emojiCount < 2) {
            enhanced = enhanced + ' 🔥';
        }
        
        // Capitalizar palabras clave al inicio
        const words = enhanced.split(' ');
        if (words[0] && words[0][0]) {
            words[0] = words[0][0].toUpperCase() + words[0].slice(1);
            enhanced = words.join(' ');
        }
        
        // Añadir gancho al final si es muy corto
        if (enhanced.length < 100) {
            enhanced = enhanced + ' ¿Qué opinas?';
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
        const pulseScore = calculatePulseScore(text, emotionResults);
        const backlash = calculateBacklashRisk(text);
        const virality = calculateVirality(text);
        const enhancedText = enhanceText(text);
        
        let recommendation = "";
        if (pulseScore >= 70) recommendation = "Pulso alto. Ideal para contenido viral o llamativo.";
        else if (pulseScore >= 40) recommendation = "Pulso medio. Buen contenido, puede mejorar.";
        else recommendation = "Pulso bajo. El texto es plano o negativo. Revísalo.";
        
        if (backlash.level === "alto") recommendation += " ⚠️ Alto riesgo de backlash. Ten cuidado.";
        
        return {
            pulseScore: pulseScore,
            emotion: {
                dominant: emotionResults.dominant.charAt(0).toUpperCase() + emotionResults.dominant.slice(1),
                manipulation: emotionResults.manipulation
            },
            backlash: backlash,
            virality: virality,
            enhancedText: enhancedText,
            recommendation: recommendation
        };
    }
    
    return { analyzeText };
})();

window.VoidPulseCore = VoidPulseCore;