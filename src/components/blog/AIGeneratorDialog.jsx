import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AIGeneratorDialog({ open, onOpenChange, onGenerated, userLanguage }) {
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const translations = {
        en: {
            title: "Generate Article with AI",
            description: "Describe the topic you want the AI to write about. Be as specific as possible for the best results.",
            label: "Article Topic",
            placeholder: "e.g., 'A guide to calculating rental yield in Poland' or 'Top 5 emerging real estate markets in the Czech Republic'",
            generate: "Generate Article",
            generating: "Generating...",
            error_topic: "Please enter a topic.",
            error_failed: "Failed to generate article. Please try again."
        },
        sk: {
            title: "Vytvoriť článok s AI",
            description: "Popíšte tému, o ktorej má AI napísať. Pre najlepšie výsledky buďte čo najpresnejší.",
            label: "Téma článku",
            placeholder: "napr. 'Sprievodca výpočtom výnosu z prenájmu v Poľsku' alebo 'Top 5 rozvíjajúcich sa realitných trhov v Českej republike'",
            generate: "Vytvoriť článok",
            generating: "Vytváram...",
            error_topic: "Prosím, zadajte tému.",
            error_failed: "Nepodarilo sa vygenerovať článok. Skúste to prosím znova."
        }
    }
    const t = translations[userLanguage] || translations.en;

    const handleGenerate = async () => {
        if (!topic) {
            setError(t.error_topic);
            return;
        }
        setIsLoading(true);
        setError(null);

        const prompt = `You are an expert blog writer specializing in real estate investment, particularly in European markets. Your tone is professional, insightful, and accessible. Based on the following topic, write a comprehensive blog post in ${userLanguage === 'sk' ? 'Slovak' : 'English'}. The topic is: '${topic}'.

Your response must be a JSON object with the following structure:
1.  \`title\`: A compelling, SEO-friendly title for the blog post.
2.  \`slug\`: A URL-friendly slug based on the title (lowercase, hyphens for spaces, no special characters).
3.  \`excerpt\`: A short, engaging summary of the article (1-2 sentences).
4.  \`content\`: The full article content in well-structured HTML format. Use tags like \`<h2>\`, \`<h3>\`, \`<p>\`, \`<ul>\`, \`<li>\`, and \`<strong>\` for formatting. The article should be at least 500 words long.`;
        
        const responseSchema = {
            type: "object",
            properties: {
                title: { type: "string" },
                slug: { type: "string" },
                excerpt: { type: "string" },
                content: { type: "string" }
            },
            required: ["title", "slug", "excerpt", "content"]
        };

        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: prompt,
                response_json_schema: responseSchema,
            });
            onGenerated(response);
            onOpenChange(false);
            setTopic('');
        } catch (err) {
            console.error("AI Generation failed:", err);
            setError(t.error_failed);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">{t.title} <Sparkles className="w-5 h-5 text-yellow-500" /></DialogTitle>
                    <DialogDescription>{t.description}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="topic">{t.label}</Label>
                        <Textarea 
                            id="topic" 
                            value={topic} 
                            onChange={(e) => setTopic(e.target.value)} 
                            placeholder={t.placeholder}
                            rows={4}
                        />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
                <DialogFooter>
                    <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t.generating}
                            </>
                        ) : (
                            t.generate
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}