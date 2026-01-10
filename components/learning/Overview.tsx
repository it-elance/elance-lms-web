const Overview = () => {
  return (
    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar scrollbar-hide">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="Overline text-(--color-text-tertiary)">Paper Info</h3>

          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
            <span className="text-(--color-text-secondary) Overline">
              Paper :
            </span>

            <span className="text-(--color-text-secondary) Body-Extra-Small">
              Financial Accounting (FA)
            </span>

            <span className="text-(--color-text-secondary) Overline">
              Chapters Completed :
            </span>

            <span className="text-(--color-text-secondary) Body-Extra-Small">
              8/12
            </span>

            <span className="text-(--color-text-secondary) Overline">
              Exam Weightage :
            </span>

            <span className="text-(--color-text-secondary) Body-Extra-Small">
              10 - 15%
            </span>

            <span className="text-(--color-text-secondary) Overline">
              Updated :
            </span>

            <span className="text-(--color-text-secondary) Body-Extra-Small">
              25 days ago
            </span>
          </div>
        </div>

        <div className="h-px bg-(--color-border-light) w-full"></div>

        <div className="flex flex-col gap-2">
          <h3 className="Overline text-(--color-text-tertiary)">Statistics</h3>

          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
            <span className="text-(--color-text-secondary) Overline">
              Total Paper Duration :
            </span>

            <span className="text-(--color-text-secondary) Body-Extra-Small">
              7 hr 30 min
            </span>

            <span className="text-(--color-text-secondary) Overline">
              Difficulty Level :
            </span>

            <span className="text-(--color-text-secondary) Body-Extra-Small">
              Beginner
            </span>

            <span className="text-(--color-text-secondary) Overline">
              Student Completion Rate :
            </span>

            <span className="text-(--color-text-secondary) Body-Extra-Small">
              86%
            </span>

            <span className="text-(--color-text-secondary) Overline">
              Materials Available :
            </span>

            <span className="text-(--color-text-secondary) Body-Extra-Small">
              25
            </span>
          </div>
        </div>

        <div className="h-px bg-(--color-border-light) w-full"></div>

        {/* Instructors */}
        <div className="flex flex-col gap-2">
          <h3 className="Overline text-(--color-text-tertiary)">Instructors</h3>

          <ul className="list-disc list-inside Body-Extra-Small text-(--color-text-secondary) space-y-1">
            <li>Sarah William, FCCA</li>
            <li>John Tomy, ACCA</li>
          </ul>
        </div>

        <div className="h-px bg-(--color-border-light) w-full"></div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <h3 className="Overline text-(--color-text-tertiary)">Description</h3>

          <p className="Body-Extra-Small text-(--color-text-secondary) leading-relaxed">
            Financial Accounting (FA) introduces the foundational principles of
            bookkeeping, double-entry, preparation of financial statements, and
            basic interpretation skills required for ACCA exams. This paper
            builds essential knowledge for advanced financial reporting
            subjects.
          </p>
        </div>

        <div className="h-px bg-(--color-border-light) w-full"></div>

        {/* Skills you gain */}
        <div className="flex flex-col gap-2">
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
        </div>
      </div>
    </div>
  );
};

export default Overview;
