import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Loader2, Save, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AdminLegalEditor() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const params = new URLSearchParams(location.search);
    const slug = params.get('slug');
    const quillRef = useRef(null);

    const [content, setContent] = useState('');
    const [docId, setDocId] = useState(null);
    const [docTitle, setDocTitle] = useState('');

    const { data: documentData, isLoading: isDocLoading } = useQuery({
        queryKey: ['legalDocument', slug],
        queryFn: async () => {
            const docs = await base44.entities.LegalDocument.filter({ slug: slug });
            return docs[0];
        },
        enabled: !!slug,
    });

    useEffect(() => {
        if (documentData) {
            setContent(documentData.content);
            setDocId(documentData.id);
            setDocTitle(documentData.title);
        }
    }, [documentData]);

    const mutation = useMutation({
        mutationFn: (updatedContent) => base44.entities.LegalDocument.update(docId, { content: updatedContent }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['legalDocument', slug] });
            queryClient.invalidateQueries({ queryKey: ['legalDocuments'] });
        },
    });

    const handleSave = () => {
        mutation.mutate(content);
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link'],
            ['clean']
        ],
    };

    if (isDocLoading) {
        return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <Button variant="outline" onClick={() => navigate('/AdminLegal')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Legal Documents
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle>Editing: {docTitle}</CardTitle>
                    <CardDescription>Update the content for this legal document. Changes will be live immediately after saving.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        className="bg-white"
                        style={{minHeight: '400px', display: 'flex', flexDirection: 'column'}}
                    />
                    <div className="flex justify-end items-center mt-6">
                        {mutation.isSuccess && <div className="flex items-center text-green-500 mr-4"><CheckCircle className="w-4 h-4 mr-2"/> Saved</div>}
                        <Button onClick={handleSave} disabled={mutation.isLoading}>
                            {mutation.isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}