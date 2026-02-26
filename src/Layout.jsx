import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Menu,
  Users,
  UserCog,
  Settings,
  Globe,
  LogOut,
  Briefcase,
  GitCompareArrows,
  FileText,
  Loader2,
  Map,
  Shield,
  LifeBuoy,
  Layers,
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import CookieConsentBanner from "./components/cookies/CookieConsentBanner"; // Updated import path
import AppFooter from './components/layout/AppFooter'; // Updated import path
import EstivoLogo from './components/shared/EstivoLogo';

const pageSpecificStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;700&display=swap');

  :root {
    --background: 220 20% 98%; /* #F7F9FB */
    --foreground: 220 18% 24%; /* #2E3B4E */
    --card: 0 0% 100%; /* #FFFFFF */
    --card-foreground: 220 18% 24%; /* #2E3B4E */
    --popover: 0 0% 100%; /* #FFFFFF */
    --popover-foreground: 220 18% 24%; /* #2E3B4E */
    --primary: 211 100% 25%; /* #003E7E */
    --primary-foreground: 0 0% 100%;
    --secondary: 220 20% 98%; /* #F7F9FB */
    --secondary-foreground: 215 13% 47%; /* #6C7A89 */
    --muted: 220 20% 98%; /* #F7F9FB */
    --muted-foreground: 215 13% 47%; /* #6C7A89 */
    --accent: 205 100% 95%; /* A light blue for hovers */
    --accent-foreground: 211 100% 25%; /* #003E7E */
    --destructive: 355 78% 57%; /* #E53935 */
    --destructive-foreground: 0 0% 100%;
    --border: 219 14% 90%; /* #E2E6EA */
    --input: 0 0% 100%; /* #FFFFFF */
    --ring: 200 100% 44%; /* #00A3E0 */
    --radius: 0.75rem;

    --success: 161 100% 36%; /* #00B894 */
    --warning: 38 95% 58%; /* #F9A825 */

    --estivo-blue: #003E7E;
    --slate-gray: #2E3B4E;
    --steel-blue-gray: #6C7A89;
    --accent-gradient-start: #004C97;
    --accent-gradient-end: #00A3E0;
  }

  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-family: 'Manrope', sans-serif;
  }
  
  .shadow-premium {
    box-shadow: 0 4px 16px rgba(0,0,0,0.05);
  }

  .bg-accent-gradient {
    background-image: linear-gradient(90deg, var(--accent-gradient-start) 0%, var(--accent-gradient-end) 100%);
  }

  .text-gradient-accent {
    background: linear-gradient(90deg, var(--accent-gradient-start) 0%, var(--accent-gradient-end) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
`;

const LanguageSwitcher = ({ onLanguageChange, currentLang }) => {
    const languages = {
        en: "English",
        sk: "Slovenčina",
        pl: "Polski",
        hu: "Magyar",
        de: "Deutsch"
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-secondary-foreground hover:text-foreground">
                    <Globe className="w-5 h-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {Object.entries(languages).map(([code, name]) => (
                    <DropdownMenuItem key={code} onSelect={() => onLanguageChange(code)} disabled={currentLang === code}>
                        {name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const NavLink = ({ to, icon: Icon, children, isMobile = false, currentPath }) => {
    const isActive = currentPath === to;
    const baseClasses = "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-200";
    const mobileClasses = "text-lg";
    const desktopClasses = "text-sm font-medium";

    const activeClasses = "bg-accent text-accent-foreground";
    const inactiveClasses = "text-secondary-foreground hover:bg-accent/50 hover:text-foreground";
    
    return (
        <Link to={createPageUrl(to)} className={`${baseClasses} ${isMobile ? mobileClasses : desktopClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            <Icon className="h-5 w-5" />
            <span>{children}</span>
        </Link>
    );
};

export default function Layout({ children, currentPageName }) {
  console.log('🔵 LAYOUT RENDERING - Page:', currentPageName);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.substring(1) || 'Dashboard';

  // Added 'Contact' to publicPages array
  const publicPages = ['Landing', 'Blog', 'BlogPost', 'LegalDocument', 'Contact'];

  // Check actual URL path to handle routing issues
  const actualPath = window.location.pathname.toLowerCase();
  const isDashboardArea = actualPath.includes('/dashboard') || actualPath.includes('/portfolio') || 
                         actualPath.includes('/settings') || actualPath.includes('/compare') ||
                         actualPath.includes('/calculator') || actualPath.includes('/admin') ||
                         actualPath.includes('/landfeasibility');

  const isPublicPage = publicPages.includes(currentPageName) && !isDashboardArea;

  // Check authentication with proper error handling
  const { data: user, isLoading: isUserLoading, error: userError } = useQuery({ 
      queryKey: ['currentUser'], 
      queryFn: async () => {
          try {
              return await base44.auth.me();
          } catch (error) {
              console.error("Authentication check failed:", error);
              return null;
          }
      }, 
      retry: false,
      staleTime: 1000 * 60 * 5,
  });

  const { data: appSettings, isLoading: isSettingsLoading } = useQuery({
      queryKey: ['appSettings'],
      queryFn: async () => {
          // Changed to order by '-updated_date' to get the newest record, and limit to 1
          const settingsList = await base44.entities.AppSettings.list('-updated_date', 1);
          console.log('[Layout] AppSettings loaded:', settingsList);
          
          // If no settings exist, create default settings
          if (!settingsList || settingsList.length === 0) {
              console.log('[Layout] No AppSettings found, creating default...');
              const defaultSettings = await base44.entities.AppSettings.create({
                  beta_mode: true, // Default to beta mode
                  trial_enabled: false,
                  trial_duration_days: 30
              });
              console.log('[Layout] Created default AppSettings:', defaultSettings);
              return defaultSettings;
          }
          
          return settingsList[0];
      },
      enabled: !!user,
      refetchOnWindowFocus: true,
      staleTime: 0,
  });

  const updateUserMutation = useMutation({
      mutationFn: (data) => {
          console.log('[Layout] Calling updateMe with:', data);
          return base44.auth.updateMe(data);
      },
      onSuccess: (result) => {
          console.log('[Layout] User update successful:', result);
          queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      },
      onError: (error) => {
          console.error('[Layout] User update FAILED:', error);
      }
  });

  useEffect(() => {
    // Wait for both user and settings to load
    if (!user || isUserLoading || isSettingsLoading || !appSettings) {
      console.log('[Layout] Waiting for data...', {
        hasUser: !!user,
        isUserLoading,
        isSettingsLoading,
        hasSettings: !!appSettings
      });
      return;
    }

    const now = new Date();
    
    console.log('[Layout] Checking user plan upgrade...', {
      beta_mode: appSettings.beta_mode,
      current_plan: user.plan,
      is_beta_tester: user.is_beta_tester,
      trial_end_date: user.trial_end_date,
      user_id: user.id
    });

    // BETA MODE: Give all new users Pro plan for free
    if (appSettings.beta_mode === true) {
      if (!user.plan || user.plan === 'free') {
        console.log(`[Layout] BETA MODE ACTIVE - Upgrading user ${user.id} to Pro`);
        updateUserMutation.mutate({
          plan: 'pro',
          trial_end_date: null,
          is_beta_tester: true, // Mark as beta tester
        });
        return;
      } else {
        console.log(`[Layout] User ${user.id} already has plan: ${user.plan} (Beta mode active, no upgrade needed)`);
      }
    }

    // BETA MODE OFF: Handle different scenarios
    if (appSettings.beta_mode === false) {
      // Scenario 1: Beta tester should be downgraded to free
      if (user.is_beta_tester === true && user.plan === 'pro') {
        console.log(`[Layout] BETA ENDED - Downgrading beta tester ${user.id} to Free`);
        updateUserMutation.mutate({ 
          plan: 'free',
          is_beta_tester: false, // Remove beta tester flag
          trial_end_date: null, // Clear trial end date
        });
        return;
      }

      // Scenario 2: User is on a trial that has expired
      if (user.plan === 'pro' && user.trial_end_date && new Date(user.trial_end_date) < now) {
        console.log(`[Layout] Downgrading user ${user.id} to Free (trial expired)`);
        updateUserMutation.mutate({ plan: 'free' });
        return;
      }

      // Scenario 3: New user should get a trial (only if trial enabled)
      if (appSettings.trial_enabled && (!user.plan || user.plan === 'free') && !user.trial_end_date) {
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + appSettings.trial_duration_days);
        
        console.log(`[Layout] Starting trial for new user ${user.id}`);
        updateUserMutation.mutate({
          plan: 'pro',
          trial_end_date: trialEndDate.toISOString(),
        });
        return;
      }
    }
    
    // Scenario 4: Initialize new user with defaults if missing
    const needsInitialization = !user.country_code || !user.entity_type || !user.preferred_language;
    if (needsInitialization) {
      const updates = {};
      if (!user.country_code) updates.country_code = 'SK';
      if (!user.entity_type) updates.entity_type = 'FO';
      if (!user.preferred_language) updates.preferred_language = localStorage.getItem('estivo_lang') || 'en';
      
      if (Object.keys(updates).length > 0) {
        console.log(`[Layout] Initializing new user ${user.id} defaults`, updates);
        updateUserMutation.mutate(updates);
      }
    }
  }, [user, appSettings, isUserLoading, isSettingsLoading, updateUserMutation]);

  // Listen for appSettings changes
  useEffect(() => {
    const handleSettingsChange = () => {
      console.log('[Layout] Settings changed, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['appSettings'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    };
    
    window.addEventListener('appSettingsChanged', handleSettingsChange);
    return () => window.removeEventListener('appSettingsChanged', handleSettingsChange);
  }, [queryClient]);

  // Redirect to landing if user is not authenticated on protected pages
  useEffect(() => {
    // If authentication check is complete, user is null (unauthenticated), and current page is protected
    if (!isUserLoading && !user && !isPublicPage) {
      navigate(createPageUrl('Landing'));
    }
  }, [user, isUserLoading, isPublicPage, navigate]);

  const updateLanguageMutation = useMutation({
      mutationFn: (lang) => base44.auth.updateMe({ preferred_language: lang }),
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      }
  });
  
  const language = user?.preferred_language || localStorage.getItem('estivo_lang') || 'en';

  const translations = {
      en: {
          dashboard: "Dashboard",
          portfolio: "Portfolio",
          compare: "Compare",
          land_feasibility: "Feasibility Tool",
          settings: "Settings",
          logout: "Logout",
          admin_users: "User Management",
          admin_settings: "App Settings",
          admin_country_presets: "Country Presets",
          admin_blog: "Blog Management",
          admin_legal: "Legal Documents",
          admin_faq: "FAQ Management",
          admin_area: "Admin",
      },
      sk: {
          dashboard: "Prehľad",
          portfolio: "Portfólio",
          compare: "Porovnať",
          land_feasibility: "Posúdenie realizovateľnosti",
          settings: "Nastavenia",
          logout: "Odhlásiť sa",
          admin_users: "Správa používateľov",
          admin_settings: "Nastavenia aplikácie",
          admin_country_presets: "Predvoľby krajín",
          admin_blog: "Správa blogu",
          admin_legal: "Právne dokumenty",
          admin_faq: "Správa FAQ",
          admin_area: "Admin",
      },
      pl: {
          dashboard: "Panel",
          portfolio: "Portfolio",
          compare: "Porównaj",
          land_feasibility: "Narzędzie Feasibility",
          settings: "Ustawienia",
          logout: "Wyloguj się",
          admin_users: "Zarządzanie użytkownikami",
          admin_settings: "Ustawienia aplikacji",
          admin_country_presets: "Ustawienia krajów",
          admin_blog: "Zarządzanie blogiem",
          admin_legal: "Dokumenty prawne",
          admin_faq: "Zarządzanie FAQ",
          admin_area: "Admin",
      },
      hu: {
          dashboard: "Vezérlőpult",
          portfolio: "Portfólió",
          compare: "Összehasonlítás",
          land_feasibility: "Feasibility Eszköz",
          settings: "Beállítások",
          logout: "Kijelentkezés",
          admin_users: "Felhasználókezelés",
          admin_settings: "Alkalmazás beállítások",
          admin_country_presets: "Ország beállítások",
          admin_blog: "Blog kezelés",
          admin_legal: "Jogi dokumentumok",
          admin_faq: "GYIK kezelés",
          admin_area: "Admin",
      },
      de: {
          dashboard: "Dashboard",
          portfolio: "Portfolio",
          compare: "Vergleichen",
          land_feasibility: "Feasibility-Tool",
          settings: "Einstellungen",
          logout: "Abmelden",
          admin_users: "Benutzerverwaltung",
          admin_settings: "App-Einstellungen",
          admin_country_presets: "Ländereinstellungen",
          admin_blog: "Blog-Verwaltung",
          admin_legal: "Rechtsdokumente",
          admin_faq: "FAQ-Verwaltung",
          admin_area: "Admin",
      }
  };
  
  const t = translations[language] || translations.en;

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Landing')); // Redirect to Landing page after logout
  };

  // Always apply page-specific styles
  const layoutStyles = <style>{pageSpecificStyles}</style>;

  // 1. Show loading spinner during initial user authentication check for ANY page.
  // This covers the initial app load until we know user's auth status.
  if (isUserLoading) {
      return (
          <>
            {layoutStyles}
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </>
      );
  }

  // 2. Handle public pages that don't require authentication (and user loading is done)
  if (isPublicPage) {
      console.log('🟣 PUBLIC PAGE RENDERED:', currentPageName);
      return (
          <>
            {layoutStyles}
            {children}
            <CookieConsentBanner language={language} />
            {console.log('🟢 PUBLIC FOOTER AREA')}
          </>
      );
  }

  // 3. If authentication check is complete (!isUserLoading) and user is null (unauthenticated)
  // for a protected page, the useEffect above will trigger a redirect.
  // In the brief moment before navigation, display a spinner.
  // This check MUST come AFTER publicPage check, otherwise unauthenticated users on public pages would show a spinner too.
  if (!user) {
      // This state is transient, as useEffect will soon navigate away.
      return (
          <>
            {layoutStyles}
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </>
      );
  }

  // 4. If we reach here, it means:
  //    - isUserLoading is false (auth check complete)
  //    - user is not null (user is authenticated)
  //    - The page is not a public page (it's a protected page)
  // So, render the full authenticated layout.
  console.log('🟢 AUTHENTICATED LAYOUT RENDERING for:', currentPageName);

  const navItems = [
    { name: t.dashboard, href: "Dashboard", icon: LayoutDashboard },
    { name: t.portfolio, href: "Portfolio", icon: Briefcase },
    { name: t.compare, href: "Compare", icon: GitCompareArrows },
    { name: t.land_feasibility, href: "LandFeasibility", icon: Layers },
  ];

  console.log('🔷 LAYOUT: Rendering sidebar and footer');
  
  return (
    <>
      {layoutStyles}
      <div className="flex bg-background text-foreground min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0">
          <div className="p-6 flex items-center gap-3">
             <a href={createPageUrl("Landing")} className="block">
                <EstivoLogo className="h-8" />
            </a>
            {appSettings?.beta_mode && (
                <span className="px-2 py-1 text-xs font-semibold bg-amber-500 text-white rounded-full">
                    BETA
                </span>
            )}
          </div>
          <nav className="flex-1 px-4 space-y-2">
            {navItems.map((item) => (
              <NavLink key={item.name} to={item.href} icon={item.icon} currentPath={currentPath}>{item.name}</NavLink>
            ))}
            {user && user.role === "admin" && (
                <>
                  <hr className="my-4 border-border" />
                  <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.admin_area}</h3>
                   <NavLink to="AdminUsers" icon={Users} currentPath={currentPath}>{t.admin_users}</NavLink>
                   <NavLink to="AdminSettings" icon={UserCog} currentPath={currentPath}>{t.admin_settings}</NavLink>
                   <NavLink to="AdminCountryPresets" icon={Map} currentPath={currentPath}>{t.admin_country_presets}</NavLink>
                   <NavLink to="AdminBlog" icon={FileText} currentPath={currentPath}>{t.admin_blog}</NavLink>
                   <NavLink to="AdminLegal" icon={Shield} currentPath={currentPath}>{t.admin_legal}</NavLink>
                   <NavLink to="AdminFAQ" icon={LifeBuoy} currentPath={currentPath}>{t.admin_faq}</NavLink>
                </>
            )}
          </nav>
          <div className="p-4 mt-auto">
            <hr className="my-4 border-border" />
            <NavLink to="Settings" icon={Settings} currentPath={currentPath}>{t.settings}</NavLink>
            <button onClick={handleLogout} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium w-full text-left text-destructive/80 hover:bg-destructive/10 hover:text-destructive">
                <LogOut className="h-5 w-5" />
                <span>{t.logout}</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <header className="lg:hidden flex items-center justify-between bg-card border-b border-border h-16 px-4 sticky top-0 z-50">
             <div className="flex items-center gap-2">
                <a href={createPageUrl("Landing")} className="block">
                    <EstivoLogo className="h-7" />
                </a>
                {appSettings?.beta_mode && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-amber-500 text-white rounded-full">
                        BETA
                    </span>
                )}
             </div>
            <div className="flex items-center">
                <LanguageSwitcher onLanguageChange={updateLanguageMutation.mutate} currentLang={user?.preferred_language} />
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="w-6 h-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72 bg-card text-foreground border-r-0">
                    <nav className="flex flex-col h-full p-4">
                      <div className="flex-1 space-y-2 mt-8">
                        {navItems.map((item) => (
                          <div key={item.name} onClick={() => setMobileMenuOpen(false)}>
                            <NavLink to={item.href} icon={item.icon} isMobile currentPath={currentPath}>{item.name}</NavLink>
                          </div>
                        ))}
                        {user && user.role === "admin" && (
                            <>
                              <hr className="my-4 border-border" />
                              <h3 className="px-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t.admin_area}</h3>
                               <div onClick={() => setMobileMenuOpen(false)}>
                                 <NavLink to="AdminUsers" icon={Users} isMobile currentPath={currentPath}>{t.admin_users}</NavLink>
                               </div>
                               <div onClick={() => setMobileMenuOpen(false)}>
                                  <NavLink to="AdminSettings" icon={UserCog} isMobile currentPath={currentPath}>{t.admin_settings}</NavLink>
                               </div>
                               <div onClick={() => setMobileMenuOpen(false)}>
                                  <NavLink to="AdminCountryPresets" icon={Map} isMobile currentPath={currentPath}>{t.admin_country_presets}</NavLink>
                               </div>
                               <div onClick={() => setMobileMenuOpen(false)}>
                                  <NavLink to="AdminBlog" icon={FileText} isMobile currentPath={currentPath}>{t.admin_blog}</NavLink>
                               </div>
                               <div onClick={() => setMobileMenuOpen(false)}>
                                  <NavLink to="AdminLegal" icon={Shield} isMobile currentPath={currentPath}>{t.admin_legal}</NavLink>
                               </div>
                               <div onClick={() => setMobileMenuOpen(false)}>
                                  <NavLink to="AdminFAQ" icon={LifeBuoy} isMobile currentPath={currentPath}>{t.admin_faq}</NavLink>
                               </div>
                            </>
                        )}
                      </div>

                      <div className="mt-auto space-y-2">
                         <div onClick={() => setMobileMenuOpen(false)}>
                            <NavLink to="Settings" icon={Settings} isMobile currentPath={currentPath}>{t.settings}</NavLink>
                         </div>
                         <button onClick={() => {handleLogout(); setMobileMenuOpen(false);}} className="flex items-center gap-3 p-3 rounded-lg text-lg w-full text-left text-destructive/80 hover:bg-destructive/10 hover:text-destructive"><LogOut className="w-5 h-5" />{t.logout}</button>
                      </div>
                    </nav>
                  </SheetContent>
                </Sheet>
            </div>
          </header>
          
          <main className="p-4 sm:p-6 lg:p-8">
              <div className="hidden lg:flex justify-end mb-4">
                  <LanguageSwitcher onLanguageChange={updateLanguageMutation.mutate} currentLang={user?.preferred_language} />
              </div>
              {children}
          </main>

          <AppFooter language={language} />
        </div>
      </div>
      <CookieConsentBanner language={language} />
      {console.log('🟢 FOOTER RENDERED')}
    </>
  );
}