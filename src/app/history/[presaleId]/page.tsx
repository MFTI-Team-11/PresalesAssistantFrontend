import { PresaleChatPage } from '@/components/PresaleChatPage';

type PageProps = {
  params: Promise<{
    presaleId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { presaleId } = await params;

  return <PresaleChatPage presaleId={presaleId} />;
}
