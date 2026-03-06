import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import 'react-quill/dist/quill.snow.css'; // For prose styles
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { getLandingPageTranslations } from '@/components/lib/translations';
import SocialShareButtons from '@/components/blog/SocialShareButtons';
import { sanitizeHtml } from '@/components/lib/sanitizeHtml';

export default function BlogPostPage() {
    const [language, setLanguage] = useState(() => localStorage.getItem('estivo_lang') || 'en');
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const slug = params.get('slug');
    const [currentUrl, setCurrentUrl] = useState('');

    useEffect(() => {
        setCurrentUrl(window.location.href);
    }, [slug]);

    const { data: post, isLoading } = useQuery({
        queryKey: ['blogPostBySlug', slug],
        queryFn: async () => {
            const posts = await base44.entities.BlogPost.filter({ slug: slug, status: 'published' });
            return posts[0];
        },
        enabled: !!slug,
    });

    // Get localized content
    const getLocalizedContent = (post) => {
        if (!post) return null;
        
        // If current language matches primary language, return original
        if (language === post.primary_language) {
            return {
                title: post.title,
                excerpt: post.excerpt,
                content: post.content
            };
        }
        
        // Try to get translation for current language
        if (post.translations && post.translations[language]) {
            return post.translations[language];
        }
        
        // Fallback to primary language
        return {
            title: post.title,
            excerpt: post.excerpt,
            content: post.content
        };
    };

    const localizedContent = getLocalizedContent(post);
    
    const handleSetLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('estivo_lang', lang);
    };

    const t = getLandingPageTranslations(language);

    if (isLoading) {
        return (
            <div className="bg-background text-foreground flex flex-col min-h-screen">
                <PublicHeader t={t} language={language} onLanguageChange={handleSetLanguage} />
                <main className="flex-grow flex justify-center items-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </main>
                <PublicFooter t={t} />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="bg-background text-foreground flex flex-col min-h-screen">
                <PublicHeader t={t} language={language} onLanguageChange={handleSetLanguage} />
                <main className="flex-grow">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                        <h1 className="text-4xl font-bold">{t.blog_post_not_found_title}</h1>
                        <p className="mt-4">{t.blog_post_not_found_subtitle}</p>
                        <Link to={createPageUrl('Blog')} className="mt-8 inline-block">
                            <Button>{t.blog_back_to_blog}</Button>
                        </Link>
                    </div>
                </main>
                <PublicFooter t={t} />
            </div>
        );
    }

    return (
        <div className="bg-background text-foreground flex flex-col min-h-screen">
            <PublicHeader t={t} language={language} onLanguageChange={handleSetLanguage} />
            <main className="flex-grow">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-24">
                    <div className="mb-12">
                        <Link to={createPageUrl('Blog')}>
                            <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> {t.blog_back_to_blog}</Button>
                        </Link>
                    </div>
                    <article className="prose lg:prose-xl max-w-none">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">{localizedContent?.title || post.title}</h1>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div className="text-muted-foreground">
                                <span>By {post.author}</span>
                                {post.publication_date && <span> &bull; {format(new Date(post.publication_date), 'PPP')}</span>}
                            </div>
                            <SocialShareButtons url={currentUrl} title={localizedContent?.title || post.title} />
                        </div>
                        {/* The content is rendered from the rich text editor */}
                        <div className="ql-editor" style={{padding: 0}} dangerouslySetInnerHTML={{ __html: sanitizeHtml(localizedContent?.content || post.content) }} />
                    </article>
                </div>
            </main>
            {/* PublicFooter removed from this return block to address duplicate cookie banner issue as per outline */}
        </div>
    );
}