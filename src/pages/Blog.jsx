
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { getLandingPageTranslations } from '@/components/lib/translations';

const PostCard = ({ post }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="h-full flex flex-col overflow-hidden rounded-2xl shadow-premium hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-foreground">{post.title}</CardTitle>
                    {post.publication_date && <p className="text-sm text-muted-foreground pt-2">{format(new Date(post.publication_date), 'PPP')}</p>}
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-muted-foreground">{post.excerpt}</p>
                </CardContent>
                <CardFooter>
                    <Link to={createPageUrl(`BlogPost?slug=${post.slug}`)} className="w-full">
                        <Button variant="outline" className="w-full">
                            Read More <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default function BlogPage() {
    const [language, setLanguage] = useState(() => localStorage.getItem('estivo_lang') || 'en');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;

    const { data: posts, isLoading } = useQuery({
        queryKey: ['publishedBlogPosts'],
        queryFn: () => base44.entities.BlogPost.filter({ status: 'published' }, '-publication_date'),
    });

    const handleSetLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('estivo_lang', lang);
    };
    
    const t = getLandingPageTranslations(language);

    const blogTranslations = {
        en: {
            title: "Estivo Blog",
            subtitle: "Insights, tips, and strategies for smarter property investing.",
            no_posts_title: "No posts yet",
            no_posts_subtitle: "Check back soon for new content!",
            page_prev: "Previous",
            page_next: "Next",
            page_indicator: (current, total) => `Page ${current} of ${total}`,
        },
        sk: {
            title: "Estivo Blog",
            subtitle: "Poznatky, tipy a stratégie pre inteligentnejšie investovanie do nehnuteľností.",
            no_posts_title: "Zatiaľ žiadne príspevky",
            no_posts_subtitle: "Čoskoro tu nájdete nový obsah!",
            page_prev: "Predchádzajúce",
            page_next: "Ďalšie",
            page_indicator: (current, total) => `Strana ${current} z ${total}`,
        },
        pl: {
            title: "Blog Estivo",
            subtitle: "Wglądy, porady i strategie dla mądrzejszego inwestowania w nieruchomości.",
            no_posts_title: "Brak postów",
            no_posts_subtitle: "Wróć wkrótce po nowe treści!",
            page_prev: "Poprzedni",
            page_next: "Następny",
            page_indicator: (current, total) => `Strona ${current} z ${total}`,
        },
        hu: {
            title: "Estivo Blog",
            subtitle: "Betekintések, tippek és stratégiák az okosabb ingatlan befektetéshez.",
            no_posts_title: "Még nincsenek bejegyzések",
            no_posts_subtitle: "Hamarosan újra nézzen be új tartalomért!",
            page_prev: "Előző",
            page_next: "Következő",
            page_indicator: (current, total) => `${current}. oldal a ${total}-ból`,
        },
        de: {
            title: "Estivo Blog",
            subtitle: "Einblicke, Tipps und Strategien für intelligentere Immobilieninvestitionen.",
            no_posts_title: "Noch keine Beiträge",
            no_posts_subtitle: "Schauen Sie bald wieder vorbei für neue Inhalte!",
            page_prev: "Zurück",
            page_next: "Weiter",
            page_indicator: (current, total) => `Seite ${current} von ${total}`,
        }
    };

    const bt = blogTranslations[language] || blogTranslations.en;

    // Pagination logic
    const totalPages = posts ? Math.ceil(posts.length / postsPerPage) : 0;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts?.slice(indexOfFirstPost, indexOfLastPost);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo(0, 0); // Scroll to top on page change
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo(0, 0); // Scroll to top on page change
        }
    };

    return (
        <div className="bg-background text-foreground min-h-screen flex flex-col">
            <PublicHeader t={t} language={language} onLanguageChange={handleSetLanguage} />
            <main className="flex-grow">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-extrabold text-foreground sm:text-6xl">{bt.title}</h1>
                        <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">{bt.subtitle}</p>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {currentPosts?.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    )}
                     {posts?.length === 0 && !isLoading && (
                        <div className="text-center py-16">
                            <h3 className="text-xl font-semibold">{bt.no_posts_title}</h3>
                            <p className="text-muted-foreground mt-2">{bt.no_posts_subtitle}</p>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-16 space-x-4">
                            <Button variant="outline" onClick={handlePrevPage} disabled={currentPage === 1}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                {bt.page_prev}
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                {bt.page_indicator(currentPage, totalPages)}
                            </span>
                            <Button variant="outline" onClick={handleNextPage} disabled={currentPage === totalPages}>
                                {bt.page_next}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    )}
                </div>
            </main>
            <PublicFooter t={t} />
        </div>
    );
}
