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
import { Bot, Link as LinkIcon, User, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type IdeaCardProps = {
  idea: Idea;
  onDelete: (id: string) => void;
};

export function IdeaCard({ idea, onDelete }: IdeaCardProps) {
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
      <Card className="flex flex-col flex-grow shadow-md hover:shadow-xl transition-shadow duration-300 relative">
        <div className="absolute top-2 right-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Hành động này không thể được hoàn tác. Ý tưởng này sẽ bị xóa vĩnh viễn khỏi máy chủ.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(idea.id)} className="bg-destructive hover:bg-destructive/90">Xóa</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>

        <CardHeader className="pr-12">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg font-bold">Điểm sáng tạo</CardTitle>
            <Badge variant={badgeVariant} className="flex-shrink-0">{badgeText}</Badge>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Progress value={creativityPercentage} aria-label={`Điểm sáng tạo: ${creativityPercentage}%`}/>
            <span className="font-bold text-lg text-primary">{creativityPercentage}%</span>
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Đăng bởi: <strong>{idea.authorName || 'Người dùng ẩn danh'}</strong></span>
          </div>
          <p className="text-foreground text-base whitespace-pre-wrap">
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
                <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{idea.analysis}</ReactMarkdown>
                </div>
                {idea.source && (
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2 text-foreground">
                      <LinkIcon className="h-4 w-4" />
                      Nguồn tham khảo
                    </h4>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({node, ...props}) => <a {...props} rel="noopener noreferrer" className="text-primary hover:underline" />
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
