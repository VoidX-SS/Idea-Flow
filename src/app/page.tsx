'use client';

import { useState } from 'react';
import type { RankIdeasByCreativityOutput } from '@/ai/flows/rank-ideas-by-creativity';
import { submitIdeaAction } from '@/app/actions';
import { IdeaForm } from '@/components/idea-form';
import { IdeaList } from '@/components/idea-list';
import { Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface Idea extends RankIdeasByCreativityOutput {
  id: string;
  idea: string;
}

export default function Home() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddIdea = async (ideaText: string) => {
    setIsLoading(true);
    try {
      const newIdea = await submitIdeaAction({ idea: ideaText });
      
      setIdeas(prevIdeas => {
        const updatedIdeas = [newIdea, ...prevIdeas];
        updatedIdeas.sort((a, b) => b.creativityScore - a.creativityScore);
        return updatedIdeas;
      });

    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể phân tích ý tưởng. Vui lòng thử lại.',
      });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center my-8 md:my-12">
          <h1 className="font-headline text-5xl md:text-6xl font-bold text-primary flex items-center justify-center gap-4">
            <Lightbulb className="w-12 h-12" />
            Idea Stream
          </h1>
          <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">Nơi những ý tưởng tuyệt vời được chắp cánh. Gửi gắm suy nghĩ của bạn và để AI đánh giá mức độ độc đáo.</p>
        </header>
        
        <div className="max-w-2xl mx-auto mb-12">
          <IdeaForm onSubmit={handleAddIdea} isLoading={isLoading} />
        </div>

        <IdeaList ideas={ideas} isLoading={isLoading} />
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>Tạo bởi Firebase Studio</p>
      </footer>
    </div>
  );
}
