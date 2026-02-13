"use client";

import React from "react";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Plus, Trash, PencilSimple, FolderOpen, CaretRight, TreeStructure, MagnifyingGlass, X, Image as ImageIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/admin/ImageUpload";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Category {
    id: string;
    name: string;
    slug: string;
    parent_id: string | null;
    image_url: string | null;
    parent?: { name: string };
}

interface TreeNode extends Category {
    children: TreeNode[];
    level: number;
}

// Animated collapse component for smooth expand/collapse — must be outside main component
function AnimatedCollapse({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | undefined>(isOpen ? undefined : 0);
    const [isAnimating, setIsAnimating] = useState(false);
    const initialRender = useRef(true);

    useEffect(() => {
        if (!contentRef.current) return;

        // Skip animation on initial render
        if (initialRender.current) {
            initialRender.current = false;
            setHeight(isOpen ? undefined : 0);
            return;
        }

        if (isOpen) {
            const contentHeight = contentRef.current.scrollHeight;
            setHeight(0);
            // Force reflow
            contentRef.current.offsetHeight;
            requestAnimationFrame(() => {
                setHeight(contentHeight);
                setIsAnimating(true);
            });
            const timer = setTimeout(() => {
                setHeight(undefined);
                setIsAnimating(false);
            }, 350);
            return () => clearTimeout(timer);
        } else {
            const contentHeight = contentRef.current.scrollHeight;
            setHeight(contentHeight);
            // Force reflow
            contentRef.current.offsetHeight;
            requestAnimationFrame(() => {
                setHeight(0);
                setIsAnimating(true);
            });
            const timer = setTimeout(() => setIsAnimating(false), 350);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    return (
        <div
            ref={contentRef}
            style={{
                height: height !== undefined ? `${height}px` : 'auto',
                overflow: isAnimating || !isOpen ? 'hidden' : 'visible',
                transition: isAnimating ? 'height 350ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease' : 'none',
                opacity: isOpen || isAnimating ? 1 : 0,
            }}
        >
            {children}
        </div>
    );
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState("");

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [parentId, setParentId] = useState<string>("null");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [saving, setSaving] = useState(false);

    // Preselect parent for "Add child" action
    const [preselectedParentId, setPreselectedParentId] = useState<string | null>(null);

    useEffect(() => {
        if (!isDialogOpen) {
            resetForm();
        }
    }, [isDialogOpen]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('categories')
            .select(`
                *,
                parent:categories!parent_id(name)
            `)
            .order('name');

        if (error) {
            console.error(error);
        } else {
            // @ts-ignore
            setCategories(data || []);
            // Auto-expand all root categories
            const roots = (data || []).filter((c: Category) => !c.parent_id);
            setExpandedNodes(new Set(roots.map((r: Category) => r.id)));
        }
        setLoading(false);
    };

    // Build tree structure
    const tree = useMemo(() => {
        const buildTree = (parentId: string | null, level: number): TreeNode[] => {
            return categories
                .filter(c => c.parent_id === parentId)
                .map(c => ({
                    ...c,
                    level,
                    children: buildTree(c.id, level + 1)
                }))
                .sort((a, b) => a.name.localeCompare(b.name));
        };
        return buildTree(null, 0);
    }, [categories]);

    // Filter tree based on search
    const filteredTree = useMemo(() => {
        if (!searchQuery.trim()) return tree;

        const query = searchQuery.toLowerCase();

        const filterTree = (nodes: TreeNode[]): TreeNode[] => {
            return nodes.reduce<TreeNode[]>((acc, node) => {
                const matchesSelf = node.name.toLowerCase().includes(query) || node.slug.toLowerCase().includes(query);
                const filteredChildren = filterTree(node.children);

                if (matchesSelf || filteredChildren.length > 0) {
                    acc.push({
                        ...node,
                        children: matchesSelf ? node.children : filteredChildren
                    });
                }
                return acc;
            }, []);
        };

        return filterTree(tree);
    }, [tree, searchQuery]);

    // Count stats
    const stats = useMemo(() => {
        const rootCount = categories.filter(c => !c.parent_id).length;
        const groupCount = categories.filter(c => c.parent_id && categories.some(child => child.parent_id === c.id)).length;
        const leafCount = categories.filter(c => c.parent_id && !categories.some(child => child.parent_id === c.id)).length;
        return { rootCount, groupCount, leafCount, total: categories.length };
    }, [categories]);

    const resetForm = () => {
        setEditingId(null);
        setName("");
        setSlug("");
        setParentId("null");
        setImageUrl("");
        setPreselectedParentId(null);
    };

    const handleEdit = (cat: Category) => {
        setEditingId(cat.id);
        setName(cat.name);
        setSlug(cat.slug);
        setParentId(cat.parent_id || "null");
        setImageUrl(cat.image_url || "");
        setIsDialogOpen(true);
    };

    const handleAddChild = (parentCat: Category) => {
        resetForm();
        setPreselectedParentId(parentCat.id);
        setParentId(parentCat.id);
        setIsDialogOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                name,
                slug,
                parent_id: parentId === "null" ? null : parentId,
                image_url: imageUrl || null
            };

            if (editingId) {
                const { error } = await supabase.from('categories').update(payload).eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('categories').insert([payload]);
                if (error) throw error;
            }

            setIsDialogOpen(false);
            fetchCategories();
        } catch (error: any) {
            console.error(error);
            alert(`Xəta: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        const children = categories.filter(c => c.parent_id === id);
        if (children.length > 0) {
            alert("Bu kateqoriyanın alt kateqoriyaları var. Əvvəlcə onları silin.");
            return;
        }
        if (!confirm("Bu kateqoriyanı silmək istədiyinizə əminsiniz?")) return;

        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) {
            console.error(error);
            alert("Silinmə zamanı xəta baş verdi.");
        } else {
            fetchCategories();
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setName(val);
        if (!editingId) {
            setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
        }
    };

    const toggleNode = (id: string) => {
        setExpandedNodes(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // Get breadcrumb path for parent selector
    const getPath = (catId: string): string => {
        const cat = categories.find(c => c.id === catId);
        if (!cat) return "";
        if (!cat.parent_id) return cat.name;
        return `${getPath(cat.parent_id)} → ${cat.name}`;
    };

    // Grouped parent options: only root (level 0) and group (level 1) — no leaf categories
    const parentOptions = useMemo(() => {
        const options: { id: string; name: string; level: number; parentName?: string }[] = [];
        // Level 0: Root categories
        const roots = categories
            .filter(c => !c.parent_id && c.id !== editingId)
            .sort((a, b) => a.name.localeCompare(b.name));

        roots.forEach(root => {
            options.push({ id: root.id, name: root.name, level: 0 });
            // Level 1: Group categories (children of root)
            const groups = categories
                .filter(c => c.parent_id === root.id && c.id !== editingId)
                .sort((a, b) => a.name.localeCompare(b.name));
            groups.forEach(group => {
                options.push({ id: group.id, name: group.name, level: 1, parentName: root.name });
            });
        });

        return options;
    }, [categories, editingId]);

    // Render a single tree node
    const renderNode = (node: TreeNode) => {
        const isExpanded = expandedNodes.has(node.id);
        const hasChildren = node.children.length > 0;
        const childCount = node.children.length;
        const isRoot = node.level === 0;
        const isGroup = hasChildren && !isRoot; // middle level

        // Type badge
        let typeBadge = null;
        if (isRoot) {
            typeBadge = <span className="text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-full">Ana</span>;
        } else if (isGroup) {
            typeBadge = <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Qrup</span>;
        }

        return (
            <div key={node.id}>
                <div
                    className={cn(
                        "group flex items-center gap-2 sm:gap-3 py-3 px-3 sm:px-4 transition-all duration-200 border-b border-gray-100/50 hover:bg-gray-50/80",
                        isRoot && "bg-gradient-to-r from-gray-50 to-transparent",
                    )}
                    style={{ paddingLeft: `${node.level * 16 + 12}px` }}
                >
                    {/* Expand/Collapse Toggle */}
                    <button
                        onClick={() => hasChildren && toggleNode(node.id)}
                        className={cn(
                            "w-6 h-6 shrink-0 flex items-center justify-center rounded transition-all duration-200",
                            hasChildren ? "hover:bg-gray-200 cursor-pointer text-gray-600" : "text-transparent cursor-default"
                        )}
                    >
                        {hasChildren && (
                            <CaretRight
                                size={14}
                                weight="bold"
                                style={{
                                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                    transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                            />
                        )}
                    </button>

                    {/* Image / Icon */}
                    {node.image_url ? (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden border border-gray-200 shrink-0 shadow-sm">
                            <Image src={node.image_url} alt={node.name} width={40} height={40} className="object-cover w-full h-full" />
                        </div>
                    ) : (
                        <div className={cn(
                            "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0",
                            isRoot ? "bg-black/5" : isGroup ? "bg-amber-50" : "bg-gray-50"
                        )}>
                            <FolderOpen size={16} className={cn("sm:!w-[18px] sm:!h-[18px]", isRoot ? "text-black/40" : isGroup ? "text-amber-400" : "text-gray-300")} />
                        </div>
                    )}

                    {/* Name & Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "font-semibold truncate",
                                isRoot ? "text-base text-gray-900" : "text-sm text-gray-700"
                            )}>
                                {node.name}
                            </span>
                            {typeBadge}
                            {hasChildren && (
                                <span className="text-[11px] text-gray-400 font-medium">{childCount}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 mt-0.5">
                            <span className="text-xs text-gray-400 font-mono truncate">{node.slug}</span>
                            {node.parent_id && (
                                <span className="text-xs text-gray-300 hidden sm:inline">
                                    ← {categories.find(c => c.id === node.parent_id)?.name}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-0.5 sm:gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                        {node.level < 2 && (
                            <button
                                onClick={() => handleAddChild(node)}
                                className="p-1.5 sm:p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Alt kateqoriya əlavə et"
                            >
                                <Plus size={14} weight="bold" className="sm:!w-4 sm:!h-4" />
                            </button>
                        )}
                        <button
                            onClick={() => handleEdit(node)}
                            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Düzəlt"
                        >
                            <PencilSimple size={14} className="sm:!w-4 sm:!h-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(node.id)}
                            className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Sil"
                        >
                            <Trash size={14} className="sm:!w-4 sm:!h-4" />
                        </button>
                    </div>
                </div>

                {/* Children */}
                {hasChildren && (
                    <AnimatedCollapse isOpen={isExpanded}>
                        <div className="relative">
                            {/* Tree line */}
                            <div
                                className="absolute top-0 bottom-0 border-l-2 border-gray-200/60"
                                style={{ left: `${node.level * 16 + 24}px` }}
                            />
                            {node.children.map(child => renderNode(child))}
                        </div>
                    </AnimatedCollapse>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Kateqoriyalar</h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Menyu strukturunu idarə edin
                        </p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/10 transition-all hover:shadow-xl hover:shadow-black/15 hover:-translate-y-0.5 w-full sm:w-auto">
                                <Plus className="mr-2" size={18} weight="bold" /> Yeni Kateqoriya
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-xl">
                            <DialogHeader>
                                <DialogTitle className="text-xl">
                                    {editingId ? "Kateqoriyanı Düzəlt" : "Yeni Kateqoriya"}
                                </DialogTitle>
                                {preselectedParentId && !editingId && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        <span className="font-medium text-gray-700">{getPath(preselectedParentId)}</span> altında yaradılır
                                    </p>
                                )}
                            </DialogHeader>
                            <form onSubmit={handleSave} className="space-y-5 mt-2">
                                {/* Parent Selector */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Ana Kateqoriya</Label>
                                    <select
                                        className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                                        value={parentId}
                                        onChange={(e) => setParentId(e.target.value)}
                                    >
                                        <option value="null">— Ana Kateqoriya (Root) —</option>
                                        {parentOptions.map((opt) => (
                                            <option key={opt.id} value={opt.id}>
                                                {opt.level === 0 ? opt.name : `    ${opt.parentName} → ${opt.name}`}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-400">
                                        {parentId === "null"
                                            ? "Headerdə görünəcək ana kateqoriya (Kişi, Qadın, Uşaq...)"
                                            : categories.find(c => c.id === parentId && !c.parent_id)
                                                ? "Bu kateqoriya headerdə qrup başlığı kimi görünəcək (Geyim, Ayaqqabı...)"
                                                : "Bu kateqoriya menyu elementr kimi görünəcək"
                                        }
                                    </p>
                                </div>

                                {/* Name & Slug */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Ad</Label>
                                        <Input
                                            value={name}
                                            onChange={handleNameChange}
                                            placeholder="Məs: Geyim"
                                            required
                                            className="h-11 rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-black/10 focus:border-black"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Slug</Label>
                                        <Input
                                            value={slug}
                                            onChange={(e) => setSlug(e.target.value)}
                                            placeholder="geyim"
                                            required
                                            className="h-11 rounded-lg border-gray-200 shadow-sm font-mono text-gray-600 focus:ring-2 focus:ring-black/10 focus:border-black"
                                        />
                                    </div>
                                </div>

                                {/* Image Upload */}
                                {parentId === "null" && (
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                            Şəkil <span className="text-amber-500 normal-case font-normal">(Ana kateqoriyalar üçün tövsiyə olunur)</span>
                                        </Label>
                                        <ImageUpload
                                            value={imageUrl ? [imageUrl] : []}
                                            onChange={(urls) => setImageUrl(urls[0] || "")}
                                            onRemove={() => setImageUrl("")}
                                        />
                                    </div>
                                )}

                                {/* Preview */}
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Önizləmə</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center">
                                            {imageUrl ? (
                                                <Image src={imageUrl} alt="" width={32} height={32} className="rounded-md object-cover" />
                                            ) : (
                                                <FolderOpen size={16} className="text-gray-300" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-800">{name || "Kateqoriya adı"}</p>
                                            <p className="text-xs text-gray-400 font-mono">/{slug || "slug"}</p>
                                        </div>
                                        {parentId !== "null" && (
                                            <span className="text-xs text-gray-300 ml-auto">
                                                ← {categories.find(c => c.id === parentId)?.name}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-black text-white rounded-lg shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/15 transition-all"
                                    disabled={saving}
                                >
                                    {saving ? "Saxlanılır..." : editingId ? "Yenilə" : "Yarat"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                    { label: "Ümumi", value: stats.total, color: "bg-gray-100 text-gray-700" },
                    { label: "Ana", value: stats.rootCount, color: "bg-black/5 text-black" },
                    { label: "Qrup", value: stats.groupCount, color: "bg-amber-50 text-amber-700" },
                    { label: "Alt", value: stats.leafCount, color: "bg-emerald-50 text-emerald-700" },
                ].map(stat => (
                    <div key={stat.label} className={cn("rounded-xl p-3 sm:p-4 text-center transition-all", stat.color)}>
                        <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                        <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider opacity-60">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                    placeholder="Kateqoriya axtar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-black/10 focus:border-black"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Tree View Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                    <TreeStructure size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Kateqoriya Ağacı</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setExpandedNodes(new Set(categories.map(c => c.id)))}
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        Hamısını aç
                    </button>
                    <span className="text-gray-200">|</span>
                    <button
                        onClick={() => setExpandedNodes(new Set())}
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        Hamısını bağla
                    </button>
                </div>
            </div>

            {/* Tree */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex items-center justify-center py-16 text-gray-400">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                            <span className="text-sm">Yüklənir...</span>
                        </div>
                    </div>
                ) : filteredTree.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <FolderOpen size={48} className="mb-3 text-gray-200" />
                        <p className="font-medium text-gray-500">{searchQuery ? "Nəticə tapılmadı" : "Kateqoriya yoxdur"}</p>
                        <p className="text-sm text-gray-400 mt-1">
                            {searchQuery ? "Axtarış sorğusunu dəyişin" : "\"Yeni Kateqoriya\" düyməsini istifadə edin"}
                        </p>
                    </div>
                ) : (
                    filteredTree.map(node => renderNode(node))
                )}
            </div>

            {/* Help Section */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-sm">
                    <div className="flex items-start gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-full shrink-0 mt-0.5">Ana</span>
                        <div>
                            <p className="font-medium text-gray-700">Ana Kateqoriya</p>
                            <p className="text-gray-400 text-xs mt-0.5">Headerdə görünən əsas kateqoriya</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full shrink-0 mt-0.5">Qrup</span>
                        <div>
                            <p className="font-medium text-gray-700">Qrup Kateqoriya</p>
                            <p className="text-gray-400 text-xs mt-0.5">Menyuda sütun başlığı</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                        <div>
                            <p className="font-medium text-gray-700">Alt Kateqoriya</p>
                            <p className="text-gray-400 text-xs mt-0.5">Menyuda kliklənən keçid</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
