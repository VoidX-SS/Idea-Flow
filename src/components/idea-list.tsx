'use client';

import type { Idea } from '@/app/page';
import { IdeaCard } from '@/components/idea-card';
import { Skeleton } from '@/components/ui/skeleton';
import { BrainCircuit } from 'lucide-react';

type IdeaListProps = {
  ideas: Idea[];
  isLoading: boolean;
  onDelete: (id: string) => void;
};

export function IdeaList({ ideas, isLoading, onDelete }: IdeaListProps) {
  if (isLoading && ideas.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3 p-4 rounded-xl bg-card">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!isLoading && ideas.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-16 border-2 border-dashed rounded-lg">
        <BrainCircuit className="mx-auto h-12 w-12 mb-4" />
        <h3 className="text-xl font-semibold">Chưa có ý tưởng nào</h3>
        <p>Hãy là người đầu tiên chia sẻ một ý tưởng đột phá!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
      {ideas.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} onDelete={onDelete} />
      ))}
    </div>
  );
}
