'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

const formSchema = z.object({
  authorName: z.string().min(2, {
    message: 'Tên phải có ít nhất 2 ký tự.',
  }).max(50, {
    message: 'Tên không được vượt quá 50 ký tự.',
  }),
  idea: z.string().min(10, {
    message: 'Ý tưởng phải có ít nhất 10 ký tự.',
  }).max(500, {
    message: 'Ý tưởng không được vượt quá 500 ký tự.',
  }),
});

type IdeaFormProps = {
  onSubmit: (ideaText: string, authorName: string) => Promise<void>;
  isLoading: boolean;
};

export function IdeaForm({ onSubmit, isLoading }: IdeaFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      authorName: '',
      idea: '',
    },
  });

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values.idea, values.authorName);
    form.reset();
  };

  return (
    <Card className="shadow-lg border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-center font-headline text-2xl">Chia sẻ ý tưởng của bạn</CardTitle>
        <CardDescription className="text-center">Mọi ý tưởng, dù nhỏ nhất, đều có thể thay đổi thế giới.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="authorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên của bạn</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên của bạn..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="idea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ý tưởng</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ví dụ: Một ứng dụng di động kết nối những người yêu thú cưng để cùng dắt chó đi dạo..."
                      className="resize-none text-base bg-background"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full font-bold text-lg py-6">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang phân tích...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Gửi ý tưởng
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
