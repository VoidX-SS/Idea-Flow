import type { Idea } from '@/app/page';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Bot, Link as LinkIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type IdeaCardProps = {
  idea: Idea;
};

export function IdeaCard({ idea }: IdeaCardProps) {
  const creativityPercentage = Math.round(idea.creativityScore * 100);

  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "secondary";
  let badgeText = "Tiềm năng";

  if (creativityPercentage >= 80) {
    badgeVariant = "default";
    badgeText = "Đột phá";
  } else if (creativityPercentage >= 50) {
    badgeVariant = "secondary";
    badgeText = "Sáng tạo";
  } else if (creativityPercentage >= 20) {
    badgeVariant = "outline";
    badgeText = "Cần cải thiện";
  } else {
    badgeVariant = "destructive";
    badgeText = "Phổ biến";
  }

  return (
    <article className="flex flex-col animate-in fade-in-0 zoom-in-95">
      <Card className="flex flex-col flex-grow shadow-md hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg font-bold">Điểm sáng tạo</CardTitle>
            <Badge variant={badgeVariant} className="flex-shrink-0">{badgeText}</Badge>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Progress value={creativityPercentage} aria-label={`Điểm sáng tạo: ${creativityPercentage}%`}/>
            <span className="font-bold text-lg text-primary">{creativityPercentage}%</span>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground text-base line-clamp-4">
            {idea.idea}
          </p>
        </CardContent>
        <CardFooter>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline py-2">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  <span>Phân tích từ AI</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pt-2 space-y-4">
                <p>{idea.analysis}</p>
                {idea.source && (
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2 text-foreground">
                      <LinkIcon className="h-4 w-4" />
                      Nguồn tham khảo
                    </h4>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" />
                        }}
                      >
                        {idea.source}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardFooter>
      </Card>
    </article>
  );
}
