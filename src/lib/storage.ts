import { AnalysisEntry } from "./analysis";

const STORAGE_KEY = "placement_prep_analysis_history";

export const saveAnalysis = (analysis: AnalysisEntry) => {
    const history = getHistory();
    // Prepend new analysis
    const updatedHistory = [analysis, ...history];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
};

export const updateAnalysis = (updatedAnalysis: AnalysisEntry) => {
    const history = getHistory();
    const index = history.findIndex((a) => a.id === updatedAnalysis.id);
    if (index !== -1) {
        history[index] = { ...updatedAnalysis, updatedAt: Date.now() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
};

export const getHistory = (): AnalysisEntry[] => {
    try {
        const historyJson = localStorage.getItem(STORAGE_KEY);
        if (!historyJson) return [];

        const history = JSON.parse(historyJson);
        if (!Array.isArray(history)) return [];

        // Schema validation / Filtering corrupt entries
        // We check for 'id' and 'finalScore' as a marker of the new schema
        // If 'finalScore' is missing but 'readinessScore' exists (old schema), we could migrate on the fly
        // For strict robustness as requested: "If localStorage has corrupted entry, skip"

        const validHistory = history.filter(entry => {
            return entry && typeof entry === 'object' && typeof entry.id === 'string' && typeof entry.finalScore === 'number';
        });

        return validHistory as AnalysisEntry[];
    } catch (e) {
        console.error("Failed to parse analysis history", e);
        return [];
    }
};

export const getAnalysis = (id: string): AnalysisEntry | undefined => {
    const history = getHistory();
    return history.find((analysis) => analysis.id === id);
};

export const getLatestAnalysis = (): AnalysisEntry | undefined => {
    const history = getHistory();
    return history.length > 0 ? history[0] : undefined;
};
