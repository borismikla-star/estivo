import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { Loader2, UserPlus, Trash2, Download, Edit, MoreHorizontal } from 'lucide-react'; // Added MoreHorizontal back as it was removed
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DeleteConfirmationDialog from '../components/shared/DeleteConfirmationDialog';
import UserEditDialog from '../components/admin/UserEditDialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';

const roleColors = {
  admin: 'bg-red-100 text-red-800',
  user: 'bg-blue-100 text-blue-800',
};

const planColors = {
  free: 'bg-gray-100 text-gray-800',
  pro: 'bg-green-100 text-green-800',
  business: 'bg-purple-100 text-purple-800',
};

export default function AdminUsersPage() { // Renamed from AdminUsers
    const queryClient = useQueryClient();
    const [selectedUserIds, setSelectedUserIds] = useState(new Set());
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [isUserEditDialogOpen, setIsUserEditDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const { data: user, isLoading: isUserLoading } = useQuery({ queryKey: ['currentUser'], queryFn: () => base44.auth.me() });
    
    const { data: users, isLoading: areUsersLoading } = useQuery({
        queryKey: ['allUsers'],
        queryFn: () => base44.entities.User.list('-created_date', 1000),
        enabled: !!user && user.role === 'admin',
    });

    const deleteUserMutation = useMutation({
        mutationFn: (userId) => base44.entities.User.delete(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allUsers'] });
            setIsDeleteDialogOpen(false);
            setEditingUser(null);
        }
    });

    const updateUserMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.User.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allUsers'] });
            setIsUserEditDialogOpen(false);
            setEditingUser(null);
        }
    });

    const { mutate: inviteUser, isLoading: isInviting } = useMutation({
        mutationFn: (email) => base44.auth.inviteUser(email),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allUsers'] });
            setIsInviteDialogOpen(false);
        },
    });

    const handleEditUser = (userToEdit) => {
        setEditingUser(userToEdit);
        setIsUserEditDialogOpen(true);
    };
    
    const handleExportCSV = () => {
        if (!users || users.length === 0) return;

        const headers = ['email', 'full_name', 'plan', 'country', 'entity_type', 'registration_date'];
        
        const csvRows = [
            headers.join(','), // Header row
            ...users.map(u => [
                u.email,
                `"${(u.full_name || '').replace(/"/g, '""')}"`, // Handle names with commas and double quotes
                u.plan || 'free',
                u.country || '',
                u.entity_type || 'FO',
                format(new Date(u.created_date), 'yyyy-MM-dd')
            ].join(','))
        ];

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `base44_users_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const language = user?.preferred_language || 'en';

    const translations = {
        en: {
            title: "User Management",
            subtitle: "Manage user accounts and permissions",
            search: "Search users...",
            all_plans: "All Plans",
            free_plan: "Free",
            pro_plan: "Pro",
            business_plan: "Business",
            name: "Name",
            email: "Email",
            plan: "Plan",
            role: "Role",
            created: "Created",
            actions: "Actions",
            edit: "Edit",
            delete: "Delete",
            no_users: "No users found",
            no_users_desc: "No users match your search criteria.",
            edit_user: "Edit User",
            delete_confirm_title: "Delete User?",
            delete_confirm_desc: "Are you sure you want to delete this user? This action cannot be undone.",
            cancel: "Cancel",
            invite_user: "Invite User",
            invite_info_title: "How to Invite Users",
            invite_info_desc: "To invite new users to your application, please use the 'Invite User' feature located in the 'Users' tab of your Base44 app dashboard. This ensures a secure invitation process.",
            ok: "OK",
            delete_selected: (count) => `Delete ${count} users`,
            loading: "Loading users...",
        },
        sk: {
            title: "Správa používateľov",
            subtitle: "Spravujte používateľské účty a oprávnenia",
            search: "Vyhľadať používateľov...",
            all_plans: "Všetky plány",
            free_plan: "Free",
            pro_plan: "Pro",
            business_plan: "Business",
            name: "Meno",
            email: "Email",
            plan: "Plán",
            role: "Rola",
            created: "Vytvorené",
            actions: "Akcie",
            edit: "Upraviť",
            delete: "Odstrániť",
            no_users: "Žiadni používatelia nenájdení",
            no_users_desc: "Žiadni používatelia nezodpovedajú vašim kritériám vyhľadávania.",
            edit_user: "Upraviť používateľa",
            delete_confirm_title: "Odstrániť používateľa?",
            delete_confirm_desc: "Naozaj chcete odstrániť tohto používateľa? Túto akciu nemožno vrátiť späť.",
            cancel: "Zrušiť",
            invite_user: "Pozvať používateľa",
            invite_info_title: "Ako pozvať používateľov",
            invite_info_desc: "Pre pozvanie nových používateľov do vašej aplikácie, prosím, použite funkciu 'Pozvať používateľa', ktorá sa nachádza v záložke 'Users' na hlavnom paneli vašej aplikácie v Base44. Tým sa zabezpečí bezpečný proces pozvania.",
            ok: "OK",
            delete_selected: (count) => `Odstrániť ${count} používateľov`,
            loading: "Načítavam používateľov...",
        },
        pl: {
            title: "Zarządzanie użytkownikami",
            subtitle: "Zarządzaj kontami użytkowników i uprawnieniami",
            search: "Szukaj użytkowników...",
            all_plans: "Wszystkie plany",
            free_plan: "Darmowy",
            pro_plan: "Pro",
            business_plan: "Biznes",
            name: "Imię",
            email: "Email",
            plan: "Plan",
            role: "Rola",
            created: "Utworzono",
            actions: "Akcje",
            edit: "Edytuj",
            delete: "Usuń",
            no_users: "Nie znaleziono użytkowników",
            no_users_desc: "Żaden użytkownik nie pasuje do kryteriów wyszukiwania.",
            edit_user: "Edytuj użytkownika",
            delete_confirm_title: "Usunąć użytkownika?",
            delete_confirm_desc: "Czy na pewno chcesz usunąć tego użytkownika? Tej akcji nie można cofnąć.",
            cancel: "Anuluj",
            invite_user: "Zaprosić użytkownika",
            invite_info_title: "Jak zaprosić użytkowników",
            invite_info_desc: "Aby zaprosić nowych użytkowników do swojej aplikacji, użyj funkcji 'Zaprosić użytkownika' znajdującej się w zakładce 'Użytkownicy' na pulpicie nawigacyjnym aplikacji Base44. Zapewnia to bezpieczny proces zapraszania.",
            ok: "OK",
            delete_selected: (count) => `Usuń ${count} użytkowników`,
            loading: "Ładowanie użytkowników...",
        },
        hu: {
            title: "Felhasználókezelés",
            subtitle: "Felhasználói fiókok és jogosultságok kezelése",
            search: "Felhasználók keresése...",
            all_plans: "Minden csomag",
            free_plan: "Ingyenes",
            pro_plan: "Pro",
            business_plan: "Üzleti",
            name: "Név",
            email: "Email",
            plan: "Csomag",
            role: "Szerep",
            created: "Létrehozva",
            actions: "Műveletek",
            edit: "Szerkesztés",
            delete: "Törlés",
            no_users: "Nem találhatók felhasználók",
            no_users_desc: "Egyik felhasználó sem felel meg a keresési feltételeknek.",
            edit_user: "Felhasználó szerkesztése",
            delete_confirm_title: "Felhasználó törlése?",
            delete_confirm_desc: "Biztosan törölni szeretné ezt a felhasználót? Ez a művelet nem vonható vissza.",
            cancel: "Mégse",
            invite_user: "Felhasználó meghívása",
            invite_info_title: "Felhasználók meghívása",
            invite_info_desc: "Új felhasználók meghívásához használja a 'Felhasználó meghívása' funkciót, amely a Base44 alkalmazás irányítópultjának 'Felhasználók' lapján található. Ez biztosítja a biztonságos meghívási folyamatot.",
            ok: "OK",
            delete_selected: (count) => `Törölj ${count} felhasználót`,
            loading: "Felhasználók betöltése...",
        },
        de: {
            title: "Benutzerverwaltung",
            subtitle: "Benutzerkonten und Berechtigungen verwalten",
            search: "Benutzer suchen...",
            all_plans: "Alle Pläne",
            free_plan: "Kostenlos",
            pro_plan: "Pro",
            business_plan: "Business",
            name: "Name",
            email: "E-Mail",
            plan: "Plan",
            role: "Rolle",
            created: "Erstellt",
            actions: "Aktionen",
            edit: "Bearbeiten",
            delete: "Löschen",
            no_users: "Keine Benutzer gefunden",
            no_users_desc: "Keine Benutzer entsprechen Ihren Suchkriterien.",
            edit_user: "Benutzer bearbeiten",
            delete_confirm_title: "Benutzer löschen?",
            delete_confirm_desc: "Sind Sie sicher, dass Sie diesen Benutzer löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
            cancel: "Abbrechen",
            invite_user: "Benutzer einladen",
            invite_info_title: "Benutzer einladen",
            invite_info_desc: "Um neue Benutzer in Ihre Anwendung einzuladen, verwenden Sie bitte die Funktion 'Benutzer einladen' im Reiter 'Benutzer' Ihres Base44 App-Dashboards. Dies gewährleistet einen sicheren Einladungsprozess.",
            ok: "OK",
            delete_selected: (count) => `Lösche ${count} Benutzer`,
            loading: "Benutzer werden geladen...",
        }
    };
    const t = translations[language] || translations.en;

    // This isLoading is for the initial user data. Table specific loading is handled within the table body.
    if (isUserLoading) {
        return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl">{t.title}</CardTitle>
                            <CardDescription>{t.subtitle}</CardDescription> {/* Updated to t.subtitle */}
                        </div>
                        <div className="flex gap-2">
                             <Button variant="outline" onClick={handleExportCSV} disabled={!users || users.length === 0}>
                                <Download className="mr-2 h-4 w-4" /> Export CSV
                            </Button>
                            <Button onClick={() => setIsInviteDialogOpen(true)}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                {t.invite_user}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t.name}</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>{t.plan}</TableHead>
                                <TableHead>{t.created}</TableHead>
                                <TableHead className="text-right">{t.actions}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {areUsersLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
                                        <p className="mt-2 text-sm text-muted-foreground">{t.loading}</p>
                                    </TableCell>
                                </TableRow>
                            ) : users && users.length > 0 ? (
                                users.map(u => (
                                    <TableRow key={u.id}>
                                        <TableCell>
                                            <div className="font-medium">{u.full_name}</div>
                                            <div className="text-sm text-muted-foreground">{u.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`${roleColors[u.role]} capitalize`}>{u.role}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`${planColors[u.plan]} capitalize`}>{u.plan}</Badge>
                                        </TableCell>
                                        <TableCell>{format(new Date(u.created_date), 'MMM d, yyyy')}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" /> {/* Restored MoreHorizontal */}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEditUser(u)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        <span>{t.edit}</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => { setEditingUser(u); setIsDeleteDialogOpen(true); }}
                                                        disabled={u.email === user?.email}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        <span>{t.delete}</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                        {t.no_users}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <DeleteConfirmationDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={() => deleteUserMutation.mutate(editingUser.id)}
                title={t.delete_confirm_title}
                description={editingUser ? t.delete_confirm_desc : ""} // Adjusted to use generic description from new translations
                confirmText={t.delete}
                cancelText={t.cancel} // Added cancelText
            />

            <UserEditDialog
                user={editingUser}
                open={isUserEditDialogOpen}
                onOpenChange={setIsUserEditDialogOpen}
                onSave={(data) => updateUserMutation.mutate({ id: editingUser.id, data })}
                isSaving={updateUserMutation.isLoading}
                language={language}
            />
            
            <AlertDialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t.invite_info_title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t.invite_info_desc}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t.ok}</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}