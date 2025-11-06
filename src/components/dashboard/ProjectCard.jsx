
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash2, Home, Package, Building, LineChart } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { formatDistanceToNow } from 'date-fns';
import { enUS, sk } from 'date-fns/locale';

const projectTypeDetails = {
    long_term_lease: { icon: Home, label: 'Long-Term Lease' },
    airbnb: { icon: Package, label: 'Short-Term Rental' },
    commercial: { icon: Building, label: 'Commercial' },
    development: { icon: LineChart, label: 'Development' },
};

export default function ProjectCard({ project, language, t, onDelete, selectionMode, isSelected, onSelect }) {
    const ProjectIcon = projectTypeDetails[project.type]?.icon || Home;
    const projectLabel = projectTypeDetails[project.type]?.label || 'Project';

    const locale = language === 'sk' ? sk : enUS;

    const timeAgo = project && project.updated_at
        ? formatDistanceToNow(new Date(project.updated_at), { addSuffix: true, locale })
        : 'just now';

    return (
        <div 
            className="relative"
            onClick={() => { if (selectionMode) onSelect(project.id); }}
        >
            <Card className={`flex flex-col h-full bg-card shadow-premium border transition-all duration-200 ${isSelected ? 'border-primary ring-2 ring-primary' : 'border-border'} ${selectionMode ? 'cursor-pointer hover:border-primary/50' : 'hover:border-primary/30'}`}>
                {selectionMode && (
                    <div className="absolute top-3 right-3 z-10 p-1 bg-background/80 rounded-full pointer-events-none">
                        <Checkbox checked={isSelected} className="h-5 w-5" />
                    </div>
                )}
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="space-y-1">
                        <CardTitle className="text-lg font-semibold leading-none tracking-tight">
                            <Link 
                                to={!selectionMode ? createPageUrl(`Calculator?id=${project.id}`) : '#'} 
                                className={`hover:underline ${!selectionMode ? '' : 'pointer-events-none'}`}
                            >
                                {project.name}
                            </Link>
                        </CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <ProjectIcon className="w-4 h-4 mr-2" />
                            <span>{projectLabel}</span>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild disabled={selectionMode}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                onSelect={onDelete}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                <CardContent className="flex-grow"></CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                     <span>{(t && t.last_updated) ? `${t.last_updated} ${timeAgo}` : `Updated ${timeAgo}`}</span>
                </CardFooter>
            </Card>
        </div>
    );
}
