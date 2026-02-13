'use client';

import { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { DotsSixVertical } from '@phosphor-icons/react';
import { ContentEditor } from './ContentEditor';
import { updateSectionOrder } from '@/app/actions/content';

interface SectionSortableListProps {
    initialOrder: string[];
    groupedBlocks: Record<string, any[]>;
}

export function SectionSortableList({ initialOrder, groupedBlocks }: SectionSortableListProps) {
    const [items, setItems] = useState(initialOrder);
    const [isSaving, setIsSaving] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.indexOf(active.id as string);
            const newIndex = items.indexOf(over.id as string);
            const newOrder = arrayMove(items, oldIndex, newIndex);

            setItems(newOrder);

            // Auto-save order
            setIsSaving(true);
            await updateSectionOrder(newOrder);
            setIsSaving(false);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded border">
                    <span className="text-sm text-gray-500">
                        Bölmələrin yerini dəyişmək üçün sol tərəfdəki tutacaqdan istifadə edin.
                    </span>
                    {isSaving && <span className="text-xs text-blue-500 font-medium">Yadda saxlanılır...</span>}
                </div>

                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    <Accordion type="multiple" className="space-y-4">
                        {items.map((section) => (
                            <SortableSectionItem
                                key={section}
                                id={section}
                                blocks={groupedBlocks[section] || []}
                            />
                        ))}
                    </Accordion>
                </SortableContext>
            </div>
        </DndContext>
    );
}

function SortableSectionItem({ id, blocks }: { id: string; blocks: any[] }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="bg-white rounded-lg border border-gray-200">
            <AccordionItem value={id} className="border-0">
                <div className="flex items-center px-4">
                    <button
                        {...attributes}
                        {...listeners}
                        className="p-2 cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded text-gray-400 hover:text-gray-700"
                    >
                        <DotsSixVertical size={20} />
                    </button>
                    <AccordionTrigger className="hover:no-underline flex-1 pl-2 pr-4">
                        <span className="text-lg font-semibold uppercase tracking-wider text-gray-700">{id} Bölməsi</span>
                    </AccordionTrigger>
                </div>

                <AccordionContent className="px-6 pb-6 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                        {blocks.length > 0 ? (
                            blocks.map((block) => (
                                <ContentEditor key={block.id} block={block} />
                            ))
                        ) : (
                            <p className="text-gray-400 italic">Bu bölmə üçün redaktə edilə bilən məzmun yoxdur.</p>
                        )}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </div>
    );
}
