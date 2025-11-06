
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { Loader2, Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DeleteConfirmationDialog from '../components/shared/DeleteConfirmationDialog';

const statusColors = {
  published: 'bg-green-100 text-green-800',
  draft: 'bg-gray-100 text-gray-800',
};

export default function AdminBlogPage() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    const { data: user, isLoading: isUserLoading } = useQuery({ queryKey: ['currentUser'], queryFn: () => base44.auth.me() });

    const { data: posts, isLoading: arePostsLoading } = useQuery({
        queryKey: ['blogPosts'],
        queryFn: () => base44.entities.BlogPost.list('-created_date'),
    });

    const deleteMutation = useMutation({
        mutationFn: (postId) => base44.entities.BlogPost.delete(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
            setIsDeleteDialogOpen(false);
            setPostToDelete(null);
        },
    });

    const handleDeleteClick = (post) => {
        setPostToDelete(post);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (postToDelete) {
            deleteMutation.mutate(postToDelete.id);
        }
    };

    const language = user?.preferred_language || 'en';

    const translations = {
        en: {
            title: "Blog Management",
            subtitle: "Create and manage blog posts",
            create_new: "Create New Post",
            search: "Search posts...",
            all_status: "All Status",
            draft: "Draft",
            published: "Published",
            post_title: "Title",
            status: "Status",
            author: "Author",
            date: "Date",
            actions: "Actions",
            edit: "Edit",
            delete: "Delete",
            no_posts: "No blog posts yet",
            no_posts_desc: "Create your first post to get started.",
            delete_confirm_title: "Delete Post?",
            delete_confirm_desc: "Are you sure you want to delete this post? This action cannot be undone.",
            cancel: "Cancel",
            not_published: "Not published", // Added from original
            open_menu: "Open menu", // Added from original
        },
        sk: {
            title: "Správa blogu",
            subtitle: "Vytvárajte a spravujte blogové príspevky",
            create_new: "Vytvoriť nový príspevok",
            search: "Vyhľadať príspevky...",
            all_status: "Všetky stavy",
            draft: "Koncept",
            published: "Publikované",
            post_title: "Názov",
            status: "Stav",
            author: "Autor",
            date: "Dátum",
            actions: "Akcie",
            edit: "Upraviť",
            delete: "Odstrániť",
            no_posts: "Zatiaľ žiadne blogové príspevky",
            no_posts_desc: "Vytvorte svoj prvý príspevok a začnite.",
            delete_confirm_title: "Odstrániť príspevok?",
            delete_confirm_desc: "Naozaj chcete odstrániť tento príspevok? Túto akciu nemožno vrátiť späť.",
            cancel: "Zrušiť",
            not_published: "Nepublikované", // Added from original
            open_menu: "Otvoriť menu", // Added from original
        },
        pl: {
            title: "Zarządzanie blogiem",
            subtitle: "Twórz i zarządzaj postami na blogu",
            create_new: "Utwórz nowy post",
            search: "Szukaj postów...",
            all_status: "Wszystkie statusy",
            draft: "Szkic",
            published: "Opublikowane",
            post_title: "Tytuł",
            status: "Status",
            author: "Autor",
            date: "Data",
            actions: "Akcje",
            edit: "Edytuj",
            delete: "Usuń",
            no_posts: "Brak postów na blogu",
            no_posts_desc: "Utwórz swój pierwszy post, aby zacząć.",
            delete_confirm_title: "Usunąć post?",
            delete_confirm_desc: "Czy na pewno chcesz usunąć ten post? Tej akcji nie można cofnąć.",
            cancel: "Anuluj",
            not_published: "Nieopublikowane",
            open_menu: "Otwórz menu",
        },
        hu: {
            title: "Blog kezelés",
            subtitle: "Blogbejegyzések létrehozása és kezelése",
            create_new: "Új bejegyzés létrehozása",
            search: "Bejegyzések keresése...",
            all_status: "Minden státusz",
            draft: "Vázlat",
            published: "Közzétéve",
            post_title: "Cím",
            status: "Státusz",
            author: "Szerző",
            date: "Dátum",
            actions: "Műveletek",
            edit: "Szerkesztés",
            delete: "Törlés",
            no_posts: "Még nincsenek blogbejegyzések",
            no_posts_desc: "Hozza létre az első bejegyzését a kezdéshez.",
            delete_confirm_title: "Bejegyzés törlése?",
            delete_confirm_desc: "Biztosan törölni szeretné ezt a bejegyzést? Ez a művelet nem vonható vissza.",
            cancel: "Mégse",
            not_published: "Nincs közzétéve",
            open_menu: "Menü megnyitása",
        },
        de: {
            title: "Blog-Verwaltung",
            subtitle: "Blogbeiträge erstellen und verwalten",
            create_new: "Neuen Beitrag erstellen",
            search: "Beiträge suchen...",
            all_status: "Alle Status",
            draft: "Entwurf",
            published: "Veröffentlicht",
            post_title: "Titel",
            status: "Status",
            author: "Autor",
            date: "Datum",
            actions: "Aktionen",
            edit: "Bearbeiten",
            delete: "Löschen",
            no_posts: "Noch keine Blogbeiträge",
            no_posts_desc: "Erstellen Sie Ihren ersten Beitrag, um zu beginnen.",
            delete_confirm_title: "Beitrag löschen?",
            delete_confirm_desc: "Sind Sie sicher, dass Sie diesen Beitrag löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
            cancel: "Abbrechen",
            not_published: "Nicht veröffentlicht",
            open_menu: "Menü öffnen",
        }
    };
    const t = translations[language] || translations.en;

    if (arePostsLoading || isUserLoading) {
        return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>{t.title}</CardTitle>
                            <CardDescription>{t.subtitle}</CardDescription>
                        </div>
                        <Link to={createPageUrl('AdminBlogPostEditor')}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> {t.create_new}
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t.post_title}</TableHead>
                                <TableHead>{t.status}</TableHead>
                                <TableHead>{t.author}</TableHead>
                                <TableHead>{t.date}</TableHead>
                                <TableHead className="text-right">{t.actions}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts?.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium">{post.title}</TableCell>
                                    <TableCell>
                                        <Badge className={statusColors[post.status] || statusColors.draft}>
                                            {t[post.status.toLowerCase()] || post.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{post.author}</TableCell>
                                    <TableCell>
                                        {post.publication_date ? format(new Date(post.publication_date), 'PPP') : t.not_published}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">{t.open_menu}</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => navigate(createPageUrl(`AdminBlogPostEditor?id=${post.id}`))}>
                                                    <Edit className="mr-2 h-4 w-4" /> {t.edit}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(post)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> {t.delete}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <DeleteConfirmationDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                title={t.delete_confirm_title}
                description={t.delete_confirm_desc}
            />
        </div>
    );
}
