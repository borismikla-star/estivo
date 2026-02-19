/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AdminBlog from './pages/AdminBlog';
import AdminBlogPostEditor from './pages/AdminBlogPostEditor';
import AdminCountryPresets from './pages/AdminCountryPresets';
import AdminFAQ from './pages/AdminFAQ';
import AdminLegal from './pages/AdminLegal';
import AdminLegalEditor from './pages/AdminLegalEditor';
import AdminSettings from './pages/AdminSettings';
import AdminUsers from './pages/AdminUsers';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Calculator from './pages/Calculator';
import Compare from './pages/Compare';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Landing from './pages/Landing';
import LegalDocument from './pages/LegalDocument';
import Portfolio from './pages/Portfolio';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AdminBlog": AdminBlog,
    "AdminBlogPostEditor": AdminBlogPostEditor,
    "AdminCountryPresets": AdminCountryPresets,
    "AdminFAQ": AdminFAQ,
    "AdminLegal": AdminLegal,
    "AdminLegalEditor": AdminLegalEditor,
    "AdminSettings": AdminSettings,
    "AdminUsers": AdminUsers,
    "Blog": Blog,
    "BlogPost": BlogPost,
    "Calculator": Calculator,
    "Compare": Compare,
    "Contact": Contact,
    "Dashboard": Dashboard,
    "Home": Home,
    "Landing": Landing,
    "LegalDocument": LegalDocument,
    "Portfolio": Portfolio,
    "Pricing": Pricing,
    "Settings": Settings,
}

export const pagesConfig = {
    mainPage: "Landing",
    Pages: PAGES,
    Layout: __Layout,
};