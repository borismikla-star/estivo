import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Linkedin, Link as LinkIcon, Check } from 'lucide-react';

export default function SocialShareButtons({ url, title }) {
    const [copied, setCopied] = useState(false);

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const socialLinks = [
        {
            name: 'Facebook',
            icon: Facebook,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            className: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            name: 'X',
            icon: () => <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d666dadfd2546479ace4c8/729bc984f_image.png" alt="X" className="h-4 w-4" />,
            url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            className: 'bg-gray-800 hover:bg-gray-900'
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
            className: 'bg-blue-700 hover:bg-blue-800'
        }
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground mr-2">Share:</span>
            {socialLinks.map(social => (
                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer">
                    <Button size="icon" className={`${social.className} text-white`}>
                        <social.icon className="h-4 w-4" />
                        <span className="sr-only">Share on {social.name}</span>
                    </Button>
                </a>
            ))}
            <Button size="icon" variant="outline" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />}
                <span className="sr-only">Copy link</span>
            </Button>
        </div>
    );
}