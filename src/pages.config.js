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