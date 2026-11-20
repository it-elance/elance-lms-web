'use client';

import { useSearchParams } from 'next/navigation';
import { usePaperDetails } from '../../hooks/usePaperDetails';
import { batchDateRange } from '@/utils/batchDates';

const Overview = () => {
  const searchParams = useSearchParams();
  const paperId = searchParams.get('paper_id');
  const batchId = searchParams.get('batch_id');
  const { paperDetails, isLoading } = usePaperDetails(paperId || '', batchId);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar scrollbar-hide">
        <div className="flex flex-col gap-4 animate-pulse">
          <div className="h-6 bg-(--color-bg-secondary) rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-(--color-bg-secondary) rounded w-full mb-1"></div>
          <div className="h-4 bg-(--color-bg-secondary) rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!paperDetails) {
    return (
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar scrollbar-hide">
        <p className="text-(--color-text-secondary) Body-Small">
          No paper details available.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar scrollbar-hide">
      <div className="flex flex-col gap-4">
        {/* Paper Info */}
        <div className="flex flex-col gap-2">
          <h3 className="Overline text-(--color-text-tertiary)">Paper Info</h3>

          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-1">
              <span className="text-(--color-text-secondary) Overline">
                Paper :
              </span>

              <span className="text-(--color-text-secondary) Body-Extra-Small">
                {paperDetails?.paper_info?.paper_title} (
                {paperDetails?.paper_info?.paper_code})
              </span>
            </div>

            <div className="flex flex-row items-center gap-1">
              <span className="text-(--color-text-secondary) Overline">
                Chapters Completed :
              </span>

              <span className="text-(--color-text-secondary) Body-Extra-Small">
                {paperDetails?.paper_info?.chapters_completed}/
                {paperDetails?.paper_info?.total_chapters}
              </span>
            </div>

            <div className="flex flex-row items-center gap-1">
              <span className="text-(--color-text-secondary) Overline">
                Updated :
              </span>

              <span className="text-(--color-text-secondary) Body-Extra-Small">
                {paperDetails?.paper_info?.last_updated}
              </span>
            </div>
          </div>
        </div>

        <div className="h-px bg-(--color-border-light) w-full"></div>

        {/* Batch: the one opened, or each of the student's batches of the paper */}
        {paperDetails?.batches && paperDetails.batches.length > 0 && (
          <>
            <div className="flex flex-col gap-2">
              <h3 className="Overline text-(--color-text-tertiary)">
                {paperDetails.batches.length > 1 ? 'Batches' : 'Batch'}
              </h3>

              {paperDetails.batches.map((batch) => (
                <div key={batch.batch_id} className="flex flex-col gap-2">
                  <div className="flex flex-row items-center gap-1">
                    <span className="text-(--color-text-secondary) Overline">
                      Batch :
                    </span>

                    <span className="text-(--color-text-secondary) Body-Extra-Small">
                      {batch.batch_name}
                    </span>
                  </div>

                  <div className="flex flex-row items-center gap-1">
                    <span className="text-(--color-text-secondary) Overline">
                      Dates :
                    </span>

                    <span className="text-(--color-text-secondary) Body-Extra-Small">
                      {batchDateRange(batch.start_date, batch.end_date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-px bg-(--color-border-light) w-full"></div>
          </>
        )}

        {/* Statistics */}
        <div className="flex flex-col gap-2">
          <h3 className="Overline text-(--color-text-tertiary)">Statistics</h3>

          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-1">
              <span className="text-(--color-text-secondary) Overline">
                Total Paper Duration :
              </span>

              <span className="text-(--color-text-secondary) Body-Extra-Small">
                {paperDetails?.statistics?.total_paper_duration}
              </span>
            </div>

            <div className="flex flex-row items-center gap-1">
              <span className="text-(--color-text-secondary) Overline">
                Student Completion Rate :
              </span>

              <span className="text-(--color-text-secondary) Body-Extra-Small">
                {paperDetails?.statistics?.student_completion_rate}%
              </span>
            </div>

            <div className="flex flex-row items-center gap-1">
              <span className="text-(--color-text-secondary) Overline">
                Materials Available :
              </span>

              <span className="text-(--color-text-secondary) Body-Extra-Small">
                {paperDetails?.statistics?.materials_available}
              </span>
            </div>
          </div>
        </div>

        {paperDetails?.instructors && paperDetails?.instructors.length > 0 && (
          <>
            <div className="h-px bg-(--color-border-light) w-full"></div>

            {/* Instructors */}
            <div className="flex flex-col gap-2">
              <h3 className="Overline text-(--color-text-tertiary)">
                Instructors
              </h3>

              <ul className="list-disc list-inside Body-Extra-Small text-(--color-text-secondary) space-y-1">
                {paperDetails.instructors.map((instructor, index) => (
                  <li key={index}>
                    {instructor.name}
                    {instructor.qualification
                      ? `, ${instructor.qualification}`
                      : ''}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* <div className="h-px bg-(--color-border-light) w-full"></div> */}

        {/* Description */}
        {/* <div className="flex flex-col gap-2">
          <h3 className="Overline text-(--color-text-tertiary)">Description</h3>

          <p className="Body-Extra-Small text-(--color-text-secondary) leading-relaxed">
            Financial Accounting (FA) introduces the foundational principles of
            bookkeeping, double-entry, preparation of financial statements, and
            basic interpretation skills required for ACCA exams. This paper
            builds essential knowledge for advanced financial reporting
            subjects.
          </p>
        </div> */}

        {/* <div className="h-px bg-(--color-border-light) w-full"></div> */}

        {/* Skills you gain */}
        {/* <div className="flex flex-col gap-2">
          <h3 className="Overline text-(--color-text-tertiary)">
            Skills you gain
          </h3>

          <ul className="list-disc list-inside Body-Extra-Small text-(--color-text-secondary) space-y-1">
            <li>Understand and apply double-entry bookkeeping principles</li>
            <li>Record transactions and adjustments accurately</li>
            <li>Prepare financial statements for sole traders</li>

            <li>
              Apply basic measurement principles for assets, liabilities &
              income
            </li>

            <li>Compute and reconcile balances using control accounts</li>
            <li>Interpret financial information for decision-making</li>

            <li>
              Apply foundational accounting standards (IAS-based concepts)
            </li>
          </ul>
        </div> */}
      </div>
    </div>
  );
};

export default Overview;
