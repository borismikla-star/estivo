import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, Home, Package, Building, LineChart, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const formatCurrency = (value) => {
    if (typeof value !== 'number' || isNaN(value)) return 'N/A';
    return `€${Math.round(value).toLocaleString()}`;
};
const formatPercent = (value) => {
    if (typeof value !== 'number' || isNaN(value)) return 'N/A';
    return `${value.toFixed(1)}%`;
};

const typeDetails = {
  long_term_lease: { icon: Home, color: "bg-blue-100 text-blue-800" },
  airbnb: { icon: Package, color: "bg-sky-100 text-sky-800" },
  commercial: { icon: Building, color: "bg-slate-200 text-slate-800" },
  development: { icon: LineChart, color: "bg-amber-100 text-amber-800" },
};

export default function ProjectPerformanceTable({ projects, selectedIds, onSelectionChange, language, user }) {
  const [sortConfig, setSortConfig] = useState({ key: 'roi', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(1);
  }, [projects, sortConfig]);

  const handleRowClick = (project) => {
    // Check if project is locked (non-free plan required)
    const isFreePlan = !user?.plan || user.plan === 'free';
    const isLockedProject = isFreePlan && project.type !== 'long_term_lease';
    
    if (isLockedProject) {
      // Redirect to pricing page
      navigate(createPageUrl('Pricing'));
      return;
    }
    
    navigate(createPageUrl(`Calculator?id=${project.id}`));
  };

  const translations = {
      en: {
          title: "Project Performance",
          project_name: "Project Name",
          type: "Type",
          investment: "Investment",
          roi: "ROI",
          roi_tooltip_rental: "10-year total ROI on equity",
          roi_tooltip_dev: "Return on cost (total project)",
          cashflow: "Annual Cashflow",
          profit: "Profit", // NEW for development
          country: "Country",
          long_term_lease: "Long-Term Lease",
          commercial: "Commercial",
          airbnb: "Short-Term Rental",
          development: "Development"
      },
      sk: {
          title: "Výkonnosť Projektov",
          project_name: "Názov Projektu",
          type: "Typ",
          investment: "Investícia",
          roi: "ROI",
          roi_tooltip_rental: "10-ročný celkový ROI na vlastnom kapitáli",
          roi_tooltip_dev: "Návratnosť na nákladoch projektu",
          cashflow: "Ročný Cashflow",
          profit: "Zisk", // NEW for development
          country: "Krajina",
          long_term_lease: "Dlhodobý prenájom",
          commercial: "Komerčné",
          airbnb: "Krátky prenájom",
          development: "Development"
      },
      pl: {
          title: "Wyniki projektów",
          project_name: "Nazwa projektu",
          type: "Typ",
          investment: "Inwestycja",
          roi: "ROI",
          cashflow: "Roczny przepływ gotówki",
          profit: "Zysk", // NEW for development
          country: "Kraj",
          long_term_lease: "Najem długoterminowy",
          commercial: "Komercyjny",
          airbnb: "Najem krótkoterminowy",
          development: "Deweloperski"
      },
      hu: {
          title: "Projektek teljesítménye",
          project_name: "Projekt neve",
          type: "Típus",
          investment: "Befektetés",
          roi: "ROI",
          cashflow: "Éves pénzforgalom",
          profit: "Nyereség", // NEW for development
          country: "Ország",
          long_term_lease: "Hosszú távú bérlés",
          commercial: "Kereskedelmi",
          airbnb: "Rövid távú bérlés",
          development: "Fejlesztés"
      },
      de: {
          title: "Projektleistung",
          project_name: "Projektname",
          type: "Typ",
          investment: "Investition",
          roi: "ROI",
          cashflow: "Jährlicher Cashflow",
          profit: "Gewinn", // NEW for development
          country: "Land",
          long_term_lease: "Langzeitmiete",
          commercial: "Gewerblich",
          airbnb: "Kurzzeitvermietung",
          development: "Entwicklung"
      }
  };
  
  const t = translations[language] || translations.en;

  const processedProjects = useMemo(() => {
    return projects.map(p => {
        const kpis = p.results?.kpis || {};
        const isFreePlan = !user?.plan || user.plan === 'free';
        const isLocked = isFreePlan && p.type !== 'long_term_lease';
        
        // FIXED: Different KPIs for different project types
        let equity, monthlyCashFlow, roi;
        
        if (p.type === 'development') {
            // Development projects
            equity = kpis.total_project_costs || kpis.own_resources || 0;
            monthlyCashFlow = kpis.gross_profit || 0; // Use gross profit instead of monthly cashflow
            roi = kpis.annualized_return || kpis.return_on_cost || kpis.irr || 0;
        } else {
            // Rental projects (long_term_lease, commercial, airbnb)
            equity = kpis.total_investment || kpis.down_payment || kpis.total_equity || 0;
            monthlyCashFlow = kpis.avg_monthly_cash_flow || kpis.monthly_cash_flow || 0;
            roi = kpis.roi_10_year || kpis.roi || 0;
        }
        
        return {
            id: p.id,
            name: p.name,
            type: p.type,
            country: p.country,
            equity: equity,
            monthlyCashFlow: monthlyCashFlow,
            roi: roi,
            isLocked: isLocked,
            isDevelopment: p.type === 'development',
        };
    });
  }, [projects, user]);

  const sortedProjects = useMemo(() => {
    let sortableItems = [...processedProjects];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const valA = sortConfig.key === 'monthlyCashFlow' && !a.isDevelopment ? a[sortConfig.key] * 12 : a[sortConfig.key];
        const valB = sortConfig.key === 'monthlyCashFlow' && !b.isDevelopment ? b[sortConfig.key] * 12 : b[sortConfig.key];

        if (valA < valB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [processedProjects, sortConfig]);

  const requestSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const totalPages = Math.ceil(sortedProjects.length / projectsPerPage);
  const currentProjects = sortedProjects.slice(
      (currentPage - 1) * projectsPerPage,
      currentPage * projectsPerPage
  );

  const numSelected = currentProjects.filter(p => selectedIds.has(p.id)).length;
  const isAllSelectedOnPage = numSelected > 0 && numSelected === currentProjects.length;
  const isIndeterminate = numSelected > 0 && numSelected < currentProjects.length;

  const handleSelectAll = (checked) => {
      const newSelectedIds = new Set(selectedIds);
      if (checked) {
          currentProjects.forEach(p => {
              if (!p.isLocked) { // Only allow selection of unlocked projects
                  newSelectedIds.add(p.id);
              }
          });
      } else {
          currentProjects.forEach(p => newSelectedIds.delete(p.id));
      }
      onSelectionChange(newSelectedIds);
  };

  const handleSelectOne = (id, checked) => {
      const newSelectedIds = new Set(selectedIds);
      // isLocked check is implicitly handled by `disabled` prop on Checkbox
      if (checked) {
          newSelectedIds.add(id);
      } else {
          newSelectedIds.delete(id);
      }
      onSelectionChange(newSelectedIds);
  };

  const SortableHeader = ({ t_key, sort_key, tooltip }) => (
    <TableHead>
      <Button variant="ghost" onClick={() => requestSort(sort_key)} className="h-8 px-2 lg:px-3">
        <span className="text-xs lg:text-sm">{t[t_key]}</span>
        {tooltip && <span className="ml-1 text-[10px] text-muted-foreground hidden lg:inline">({tooltip})</span>}
        <ArrowUpDown className="ml-1 h-3 w-3 lg:h-4 lg:w-4" />
      </Button>
    </TableHead>
  );

  return (
    <div className="bg-card rounded-xl shadow-premium border border-border overflow-hidden">
      {/* Mobile: Card View */}
      <div className="block md:hidden">
        {currentProjects.map((p) => {
          const TypeIcon = typeDetails[p.type]?.icon || Home;
          const typeColor = typeDetails[p.type]?.color || "bg-gray-100 text-gray-800";
          return (
            <div
              key={p.id}
              className={`p-4 border-b border-border ${selectedIds.has(p.id) ? 'bg-accent/20' : ''} ${p.isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
              onClick={() => handleRowClick(p)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.has(p.id)}
                    onCheckedChange={(checked) => handleSelectOne(p.id, checked)}
                    aria-label={`Select project ${p.name}`}
                    disabled={p.isLocked}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{p.name}</h3>
                      {p.isLocked && <Lock className="w-4 h-4 text-amber-600" />}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <TypeIcon className="h-4 w-4 text-muted-foreground" />
                      <Badge className={`${typeColor} text-xs`}>{t[p.type] || p.type}</Badge>
                      {p.isLocked && <Badge className="bg-amber-100 text-amber-800 text-xs">Pro</Badge>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground block text-xs">{t.investment}</span>
                  <span className="font-semibold">{formatCurrency(p.equity)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">
                    {p.isDevelopment ? t.profit : t.cashflow}
                  </span>
                  <span className="font-semibold">
                    {p.isDevelopment ? formatCurrency(p.monthlyCashFlow) : formatCurrency(p.monthlyCashFlow * 12)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">{t.roi}</span>
                  <span className="font-semibold text-primary">{formatPercent(p.roi)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">{t.country}</span>
                  <span className="font-semibold">{p.country}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                  <Checkbox
                      checked={isAllSelectedOnPage}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                      data-state={isIndeterminate ? 'indeterminate' : (isAllSelectedOnPage ? 'checked' : 'unchecked')}
                      disabled={currentProjects.every(p => p.isLocked)}
                  />
              </TableHead>
              <TableHead className="min-w-[150px]">{t.project_name}</TableHead>
              <TableHead className="min-w-[120px]">{t.type}</TableHead>
              <SortableHeader t_key="investment" sort_key="equity" />
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('monthlyCashFlow')} className="h-8 px-2 lg:px-3">
                  <span className="text-xs lg:text-sm">{t.cashflow}</span>
                  <ArrowUpDown className="ml-1 h-3 w-3 lg:h-4 lg:w-4" />
                </Button>
              </TableHead>
              <SortableHeader t_key="roi" sort_key="roi" />
              <TableHead>{t.country}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProjects.map((p) => {
              const TypeIcon = typeDetails[p.type]?.icon || Home;
              const typeColor = typeDetails[p.type]?.color || "bg-gray-100 text-gray-800";
              return (
              <TableRow 
                  key={p.id}
                  data-state={selectedIds.has(p.id) ? "selected" : ""}
                  onClick={() => handleRowClick(p)}
                  className={`cursor-pointer hover:bg-accent/50 ${p.isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                      checked={selectedIds.has(p.id)}
                      onCheckedChange={(checked) => handleSelectOne(p.id, checked)}
                      aria-label={`Select project ${p.name}`}
                      disabled={p.isLocked}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {p.name}
                    {p.isLocked && <Lock className="w-4 h-4 text-amber-600" />}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                      <TypeIcon className="h-5 w-5 text-muted-foreground" />
                      <Badge className={typeColor}>{t[p.type] || p.type}</Badge>
                      {p.isLocked && <Badge className="bg-amber-100 text-amber-800">Pro</Badge>}
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(p.equity)}</TableCell>
                <TableCell>
                  {p.isDevelopment ? formatCurrency(p.monthlyCashFlow) : formatCurrency(p.monthlyCashFlow * 12)}
                </TableCell>
                <TableCell className="font-semibold">{formatPercent(p.roi)}</TableCell>
                <TableCell>{p.country}</TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border">
           <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}