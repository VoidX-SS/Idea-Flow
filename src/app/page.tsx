'use client';

import { useState } from 'react';
import type { RankIdeasByCreativityOutput } from '@/ai/flows/rank-ideas-by-creativity';
import { submitIdeaAction } from '@/app/actions';
import { IdeaForm } from '@/components/idea-form';
import { IdeaList } from '@/components/idea-list';
import { Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';

export interface Idea extends RankIdeasByCreativityOutput {
  id: string;
  idea: string;
  createdAt: any; // Firestore Timestamp
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const ideasQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'ideas'), orderBy('creativityScore', 'desc')) : null),
    [firestore]
  );
  
  const { data: ideas, isLoading: isLoadingIdeas } = useCollection<Idea>(ideasQuery);

  const handleAddIdea = async (ideaText: string) => {
    setIsLoading(true);
    try {
      if (!firestore) {
        throw new Error('Firestore is not initialized');
      }
      // 1. Get AI analysis from server action
      const result = await submitIdeaAction({ idea: ideaText });

      // 2. Save the idea and analysis to Firestore from the client
      const ideasCollection = collection(firestore, 'ideas');
      await addDoc(ideasCollection, {
        ...result,
        idea: ideaText,
        createdAt: serverTimestamp(),
      });
      // No need to manually update state, useCollection will do it.
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể phân tích hoặc lưu ý tưởng. Vui lòng thử lại.',
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

        <IdeaList ideas={ideas || []} isLoading={isLoadingIdeas || isLoading} />
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>Tạo bởi Firebase Studio</p>
      </footer>
    </div>
  );
}
