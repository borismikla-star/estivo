import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import EstivoLogo from '@/components/shared/EstivoLogo';

const NavLink = ({ href, children, isPageLink = false, onClick }) => {
    const location = useLocation();
    const isLandingPage = location.pathname === '/' || location.pathname.includes('/Landing');
    
    if (isPageLink) {
        return (
            <Link 
                to={href} 
                onClick={onClick}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
                {children}
            </Link>
        );
    }

    // If we're not on landing, convert hash links to full page URLs
    const finalHref = isLandingPage ? href : createPageUrl(`Landing${href}`);

    return (
        <a 
            href={finalHref} 
            onClick={onClick}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
            {children}
        </a>
    );
};

export default function PublicHeader({ t, language, onLanguageChange, isLoggedIn = false }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSignIn = () => {
        if (isLoggedIn) {
            window.location.href = createPageUrl('Dashboard');
        } else {
            base44.auth.redirectToLogin(createPageUrl('Dashboard'));
        }
    };

    const handleGetStarted = () => {
        if (isLoggedIn) {
            window.location.href = createPageUrl('Dashboard');
        } else {
            base44.auth.redirectToLogin(createPageUrl('Dashboard'));
        }
    };

    const signInText = isLoggedIn ? (language === 'sk' ? 'Dashboard' : 'Dashboard') : t.signIn;
    const getStartedText = isLoggedIn ? (language === 'sk' ? 'Prejsť na Dashboard' : 'Go to Dashboard') : t.getStarted;

    const languageNames = {
        en: "English",
        sk: "Slovenčina",
        pl: "Polski",
        hu: "Magyar",
        de: "Deutsch"
    };

    return (
        <header className="sticky top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center">
                    <Link to={createPageUrl("Landing")} onClick={() => setMobileMenuOpen(false)}>
                        <EstivoLogo className="h-7 sm:h-8" />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-6">
                    <NavLink href="#features">{t.nav_features}</NavLink>
                    <NavLink href="#why-estivo">{t.nav_why}</NavLink>
                    <NavLink href="#pricing">{t.nav_pricing}</NavLink>
                    <NavLink href={createPageUrl('Contact')} isPageLink={true}>{t.nav_faq}</NavLink>
                    <NavLink href={createPageUrl('Blog')} isPageLink={true}>{t.nav_blog}</NavLink>
                    <NavLink href={createPageUrl('Contact')} isPageLink={true}>{t.nav_contact}</NavLink>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-accent">
                            <Globe className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground">
                          <DropdownMenuItem onSelect={() => onLanguageChange('en')}>English</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => onLanguageChange('sk')}>Slovenčina</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => onLanguageChange('pl')}>Polski</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => onLanguageChange('hu')}>Magyar</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => onLanguageChange('de')}>Deutsch</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="ghost" onClick={handleSignIn} className="text-foreground hover:bg-accent">{signInText}</Button>
                    <Button onClick={handleGetStarted} className="bg-primary text-primary-foreground hover:bg-primary/90">{getStartedText}</Button>
                </div>

                {/* Mobile Menu Button & Language */}
                <div className="flex lg:hidden items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                            <Globe className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => onLanguageChange('en')}>English</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => onLanguageChange('sk')}>Slovenčina</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => onLanguageChange('pl')}>Polski</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => onLanguageChange('hu')}>Magyar</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => onLanguageChange('de')}>Deutsch</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                            <nav className="flex flex-col gap-6 mt-8">
                                <NavLink 
                                    href="#features" 
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {t.nav_features}
                                </NavLink>
                                <NavLink 
                                    href="#why-estivo"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {t.nav_why}
                                </NavLink>
                                <NavLink 
                                    href="#pricing"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {t.nav_pricing}
                                </NavLink>
                                <NavLink 
                                    href={createPageUrl('Contact')} 
                                    isPageLink={true}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {t.nav_faq}
                                </NavLink>
                                <NavLink 
                                    href={createPageUrl('Blog')} 
                                    isPageLink={true}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {t.nav_blog}
                                </NavLink>
                                <NavLink 
                                    href={createPageUrl('Contact')} 
                                    isPageLink={true}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {t.nav_contact}
                                </NavLink>

                                <div className="pt-6 border-t border-border space-y-3">
                                    <Button variant="outline" onClick={() => {handleSignIn(); setMobileMenuOpen(false);}} className="w-full">{signInText}</Button>
                                    <Button onClick={() => {handleGetStarted(); setMobileMenuOpen(false);}} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">{getStartedText}</Button>
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}