'use client';

import { useState } from "react";
import { updateContentBlock } from "@/app/actions/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContentBlock {
    id: string;
    section: string;
    key: string;
    value: string;
}

export function ContentEditor({ block }: { block: ContentBlock }) {
    const [value, setValue] = useState(block.value || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleUpdate = async () => {
        setLoading(true);
        setMessage(null);

        const result = await updateContentBlock(block.id, value);

        if (result.success) {
            setMessage({ type: 'success', text: 'Yadda saxlanıldı!' });
        } else {
            setMessage({ type: 'error', text: result.error || 'Xəta baş verdi' });
        }

        setLoading(false);

        // Auto-clear success message
        if (result.success) {
            setTimeout(() => setMessage(null), 2000);
        }
    };

    const isLongText = value.length > 50 || block.key.includes('text') || block.key.includes('json');

    return (
        <div className="space-y-2 p-3 bg-gray-50 rounded-md border border-gray-100/50 hover:border-gray-200 transition-colors">
            <label className="text-xs font-semibold uppercase text-gray-500 block mb-1">
                {block.key.replace(/_/g, ' ')}
            </label>

            <div className="flex gap-2 items-start">
                <div className="flex-1">
                    {isLongText ? (
                        <Textarea
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="min-h-[80px] text-sm font-mono"
                        />
                    ) : (
                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="text-sm font-mono"
                        />
                    )}
                </div>

                <Button
                    onClick={handleUpdate}
                    disabled={loading || value === block.value}
                    size="sm"
                    className="shrink-0"
                >
                    {loading ? '...' : 'Saxla'}
                </Button>
            </div>

            {message && (
                <p className={`text-xs ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                    {message.text}
                </p>
            )}
        </div>
    );
}
