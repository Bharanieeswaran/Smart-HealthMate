import { RecommendationsClient } from '@/components/recommendations-client';

export default function RecommendationsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Personalized Health Recommendations</h1>
      </div>
      <RecommendationsClient />
    </>
  );
}
