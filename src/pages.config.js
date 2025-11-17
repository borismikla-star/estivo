import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import AdminSettings from './pages/AdminSettings';
import Pricing from './pages/Pricing';
import AdminUsers from './pages/AdminUsers';
import Settings from './pages/Settings';
import Portfolio from './pages/Portfolio';
import Compare from './pages/Compare';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AdminCountryPresets from './pages/AdminCountryPresets';
import AdminBlog from './pages/AdminBlog';
import AdminBlogPostEditor from './pages/AdminBlogPostEditor';
import AdminLegal from './pages/AdminLegal';
import AdminLegalEditor from './pages/AdminLegalEditor';
import LegalDocument from './pages/LegalDocument';
import Contact from './pages/Contact';
import AdminFAQ from './pages/AdminFAQ';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Landing": Landing,
    "Dashboard": Dashboard,
    "Calculator": Calculator,
    "AdminSettings": AdminSettings,
    "Pricing": Pricing,
    "AdminUsers": AdminUsers,
    "Settings": Settings,
    "Portfolio": Portfolio,
    "Compare": Compare,
    "Blog": Blog,
    "BlogPost": BlogPost,
    "AdminCountryPresets": AdminCountryPresets,
    "AdminBlog": AdminBlog,
    "AdminBlogPostEditor": AdminBlogPostEditor,
    "AdminLegal": AdminLegal,
    "AdminLegalEditor": AdminLegalEditor,
    "LegalDocument": LegalDocument,
    "Contact": Contact,
    "AdminFAQ": AdminFAQ,
}

export const pagesConfig = {
    mainPage: "Landing",
    Pages: PAGES,
    Layout: __Layout,
};