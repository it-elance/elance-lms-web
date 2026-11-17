// The lectures page of a paper: of one batch when batchId is given (a student may be in two batches
// of a paper), opening topicId's lecture when given
export const paperUrl = (
  paperId?: string | null,
  batchId?: string | null,
  topicId?: string | null
) => {
  const params = new URLSearchParams({ paper_id: paperId ?? '' });
  if (batchId) params.set('batch_id', batchId);
  if (topicId) params.set('topic_id', topicId);
  return `/learning/videos?${params.toString()}`;
};
