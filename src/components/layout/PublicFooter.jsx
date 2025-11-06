import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const NavLink = ({ href, children }) => {
    const location = useLocation();
    const isLandingPage = location.pathname === '/' || location.pathname.includes('/Landing');
    
    if (href.startsWith('/')) { // For page links like /Blog
         return (
            <Link to={href} className="text-muted-foreground hover:text-primary transition-colors">
                {children}
            </Link>
        );
    }
    
    // Convert hash links to full URLs if not on landing
    const finalHref = isLandingPage ? href : createPageUrl(`Landing${href}`);
    
    return (
        <a href={finalHref} className="text-muted-foreground hover:text-primary transition-colors">
            {children}
        </a>
    );
};

export default function PublicFooter({ t }) {
    return (
        <footer className="py-16 bg-card border-t border-border">
            <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
                <div className="col-span-2 md:col-span-1">
                     <Link to={createPageUrl("Landing")} className="inline-block mb-4">
                        <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d666dadfd2546479ace4c8/478578f70_logo_transp120x40.png" alt="Estivo Logo" className="h-8" />
                    </Link>
                    <p className="text-muted-foreground">&copy; {new Date().getFullYear()} Estivo. {t.all_rights_reserved}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-foreground mb-4">{t.footer_product}</h4>
                    <ul className="space-y-3">
                        <li><NavLink href="#features">{t.nav_features}</NavLink></li>
                        <li><NavLink href="#pricing">{t.nav_pricing}</NavLink></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-foreground mb-4">{t.footer_resources}</h4>
                    <ul className="space-y-3">
                        <li><NavLink href={createPageUrl('Blog')}>{t.nav_blog}</NavLink></li>
                        <li><NavLink href={createPageUrl('Contact')}>{t.nav_faq}</NavLink></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-foreground mb-4">{t.footer_company}</h4>
                    <ul className="space-y-3">
                        <li><NavLink href="#why-estivo">{t.nav_why}</NavLink></li>
                        <li><NavLink href={createPageUrl('Contact')}>{t.footer_contact}</NavLink></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold text-foreground mb-4">{t.footer_legal}</h4>
                    <ul className="space-y-3">
                        <li><Link to={createPageUrl('LegalDocument?slug=terms-of-service')} className="text-muted-foreground hover:text-primary transition-colors">{t.footer_terms}</Link></li>
                        <li><Link to={createPageUrl('LegalDocument?slug=privacy-policy')} className="text-muted-foreground hover:text-primary transition-colors">{t.footer_privacy}</Link></li>
                        <li><Link to={createPageUrl('LegalDocument?slug=cookie-policy')} className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}