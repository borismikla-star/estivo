
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Loader2, Save, Send, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AIGeneratorDialog from '../components/blog/AIGeneratorDialog';

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

export default function AdminBlogPostEditor() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const params = new URLSearchParams(location.search);
    const postId = params.get('id');
    const quillRef = useRef(null);
    const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

    const [post, setPost] = useState({
        title: '',
        slug: '',
        content: '',
        author: '',
        excerpt: '',
        status: 'draft',
    });

    const { data: user } = useQuery({ queryKey: ['currentUser'], queryFn: () => base44.auth.me() });

    const { data: existingPost, isLoading: isPostLoading } = useQuery({
        queryKey: ['blogPost', postId],
        queryFn: () => base44.entities.BlogPost.get(postId),
        enabled: !!postId,
    });

    useEffect(() => {
        if (existingPost) {
            setPost(existingPost);
        } else if (user && !postId) {
            setPost(prev => ({ ...prev, author: user.full_name || '' }));
        }
    }, [existingPost, user, postId]);

    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            if (input.files && input.files.length > 0) {
                const file = input.files[0];
                try {
                    // Assuming base44.integrations.Core.UploadFile accepts a File object directly
                    const res = await base44.integrations.Core.UploadFile({ file });
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index, 'image', res.file_url);
                } catch (error) {
                    console.error('Image upload failed:', error);
                    // Optionally, show an error to the user
                    alert('Failed to upload image. Please try again.');
                }
            }
        };
    }, []);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                ['link', 'image', 'video'],
                ['clean']
            ],
            handlers: {
                image: imageHandler,
            },
        },
    }), [imageHandler]);

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
    ];

    const mutation = useMutation({
        mutationFn: (postData) => {
            const dataToSave = { ...postData };
            if (dataToSave.status === 'published' && !dataToSave.publication_date) {
                dataToSave.publication_date = new Date().toISOString();
            }
            if (postId) {
                return base44.entities.BlogPost.update(postId, dataToSave);
            }
            return base44.entities.BlogPost.create(dataToSave);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
            navigate('/AdminBlog');
        },
    });

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setPost(prev => ({
            ...prev,
            title: newTitle,
            slug: slugify(newTitle),
        }));
    };

    const handleFieldChange = (field, value) => {
        setPost(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = (newStatus) => {
        mutation.mutate({ ...post, status: newStatus });
    };

    const handleAiGeneratedContent = (data) => {
        setPost(prev => ({
            ...prev,
            title: data.title || '',
            slug: data.slug || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
        }));
    };

    const language = user?.preferred_language || 'en';
    const translations = {
        en: {
            back_to_posts: "Back to All Posts",
            edit_post: "Edit Post",
            create_post: "Create New Post",
            description: "Fill in the details, or generate an article with AI.",
            label_title: "Title",
            label_slug: "Slug",
            label_author: "Author",
            label_excerpt: "Excerpt",
            placeholder_excerpt: "A short summary for previews...",
            label_content: "Content",
            save_draft: "Save Draft",
            publish: "Publish",
            generate_with_ai: "Generate with AI"
        },
        sk: {
            back_to_posts: "Späť na všetky príspevky",
            edit_post: "Upraviť príspevok",
            create_post: "Vytvoriť nový príspevok",
            description: "Vyplňte podrobnosti alebo vygenerujte článok pomocou AI.",
            label_title: "Názov",
            label_slug: "URL slug",
            label_author: "Autor",
            label_excerpt: "Úryvok",
            placeholder_excerpt: "Krátke zhrnutie pre náhľady...",
            label_content: "Obsah",
            save_draft: "Uložiť ako koncept",
            publish: "Publikovať",
            generate_with_ai: "Vytvoriť s AI"
        },
    };
    const t = translations[language] || translations.en;

    if (isPostLoading || !user) {
        return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Button variant="outline" onClick={() => navigate('/AdminBlog')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t.back_to_posts}
                </Button>
                <Button variant="outline" onClick={() => setIsAiDialogOpen(true)}>
                    <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
                    {t.generate_with_ai}
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{postId ? t.edit_post : t.create_post}</CardTitle>
                    <CardDescription>{t.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="title">{t.label_title}</Label>
                            <Input id="title" value={post.title} onChange={handleTitleChange} />
                        </div>
                        <div>
                            <Label htmlFor="slug">{t.label_slug}</Label>
                            <Input id="slug" value={post.slug} onChange={(e) => handleFieldChange('slug', e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="author">{t.label_author}</Label>
                        <Input id="author" value={post.author} onChange={(e) => handleFieldChange('author', e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="excerpt">{t.label_excerpt}</Label>
                        <Textarea id="excerpt" value={post.excerpt} onChange={(e) => handleFieldChange('excerpt', e.target.value)} placeholder={t.placeholder_excerpt}/>
                    </div>
                    <div>
                        <Label>{t.label_content}</Label>
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={post.content}
                            onChange={(value) => handleFieldChange('content', value)}
                            modules={modules}
                            formats={formats}
                            className="bg-white"
                        />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <Button variant="outline" onClick={() => handleSave('draft')} disabled={mutation.isLoading}>
                            {mutation.isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            {t.save_draft}
                        </Button>
                        <Button onClick={() => handleSave('published')} disabled={mutation.isLoading}>
                             {mutation.isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            {t.publish}
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <AIGeneratorDialog
                open={isAiDialogOpen}
                onOpenChange={setIsAiDialogOpen}
                onGenerated={handleAiGeneratedContent}
                userLanguage={language}
            />
        </div>
    );
}
