
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Loader2 } from 'lucide-react';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { getLandingPageTranslations } from '@/components/lib/translations';
import 'react-quill/dist/quill.snow.css';

export default function LegalDocumentPage() {
    const [language, setLanguage] = useState(() => localStorage.getItem('estivo_lang') || 'en');
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const slug = params.get('slug');

    const { data: document, isLoading } = useQuery({
        queryKey: ['legalDocumentBySlug', slug],
        queryFn: async () => {
            const docs = await base44.entities.LegalDocument.filter({ slug });
            return docs[0];
        },
        enabled: !!slug,
    });
    
    const handleSetLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('estivo_lang', lang);
    };

    const t = getLandingPageTranslations(language);

    return (
        <div className="bg-background text-foreground flex flex-col min-h-screen">
            <PublicHeader t={t} language={language} onLanguageChange={handleSetLanguage} />
            <main className="flex-grow">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-24">
                    {isLoading ? (
                         <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        </div>
                    ) : document ? (
                        <article className="prose lg:prose-xl max-w-none">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-8">{document.title}</h1>
                            <div className="ql-editor" style={{padding: 0}} dangerouslySetInnerHTML={{ __html: document.content }} />
                        </article>
                    ) : (
                        <div className="text-center">
                            <h1 className="text-4xl font-bold">Document Not Found</h1>
                            <p className="mt-4">The document you are looking for does not exist.</p>
                        </div>
                    )}
                </div>
            </main>
            <PublicFooter t={t} />
        </div>
    );
}
