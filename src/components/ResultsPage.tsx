import { useMemo } from "react";
import type { UserFormSubmission } from "./formState";

const fallbackAverage = 57000;

const averageSalaryByJobRole: Record<string, number> = {
  "Software Engineer": 68000,
  "Data Analyst": 52000,
  Manager: 60000,
};

const averageSalaryByEmploymentType: Record<string, number> = {
  "Full-time": 62000,
  "Part-time": 32000,
};

const averageSalaryByGender: Record<string, number> = {
  Male: 61000,
  Female: 54000,
  "Non-binary": 56000,
};

const averageSalaryByEthnicity: Record<string, number> = {
  White: 61000,
  Black: 52000,
  Mixed: 55000,
  Arab: 50000,
  Asian: 57000,
  Other: 54000,
};

const averageSalaryByAgeBand: Record<string, number> = {
  "18-24": 32000,
  "25-34": 45000,
  "35-44": 56000,
  "45-54": 60000,
  "55-64": 58000,
  "65+": 47000,
};

const averageSalaryByExperience: Record<string, number> = {
  "0-2": 35000,
  "3-5": 45000,
  "6-10": 55000,
  "11-15": 63000,
  "16+": 68000,
};

const averageSalaryByChildren: Record<string, number> = {
  "0": 60000,
  "1": 58000,
  "2+": 55000,
};

const determineAgeBand = (age: number): string => {
  if (age < 25) return "18-24";
  if (age < 35) return "25-34";
  if (age < 45) return "35-44";
  if (age < 55) return "45-54";
  if (age < 65) return "55-64";
  return "65+";
};

const determineExperienceBand = (years: number): string => {
  if (years <= 2) return "0-2";
  if (years <= 5) return "3-5";
  if (years <= 10) return "6-10";
  if (years <= 15) return "11-15";
  return "16+";
};

const determineChildrenBand = (count: number): string => {
  if (count <= 0) return "0";
  if (count === 1) return "1";
  return "2+";
};

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

type ComparisonMetric = {
  id: string;
  label: string;
  description: string;
  average: number;
  user: number;
  percentDifference: number;
};

type ResultsPageProps = {
  submission: UserFormSubmission;
  onEdit: () => void;
};

const ResultsPage = ({ submission, onEdit }: ResultsPageProps) => {
  const comparisons = useMemo<ComparisonMetric[]>(() => {
    const ageBand = determineAgeBand(submission.age);
    const experienceBand = determineExperienceBand(submission.experience);
    const childrenBand = determineChildrenBand(submission.children);

    const buildMetric = (
      id: string,
      label: string,
      description: string,
      average: number
    ): ComparisonMetric => ({
      id,
      label,
      description,
      average,
      user: submission.salary,
      percentDifference: calculatePercentDifference(submission.salary, average),
    });

    return [
      buildMetric(
        "jobRole",
        `Job role: ${submission.jobRole}`,
        "Average salary for your selected role (mock data).",
        averageSalaryByJobRole[submission.jobRole] ?? fallbackAverage
      ),
      buildMetric(
        "employmentType",
        `Employment type: ${submission.employmentType}`,
        "Average salary by employment type (mock data).",
        averageSalaryByEmploymentType[submission.employmentType] ??
          fallbackAverage
      ),
      buildMetric(
        "gender",
        `Gender: ${submission.gender}`,
        "Average salary by gender (mock data).",
        averageSalaryByGender[submission.gender] ?? fallbackAverage
      ),
      buildMetric(
        "age",
        `Age band: ${ageBand}`,
        "Average salary by age band (mock data).",
        averageSalaryByAgeBand[ageBand] ?? fallbackAverage
      ),
      buildMetric(
        "experience",
        `Experience: ${experienceBand} years`,
        "Average salary by experience (mock data).",
        averageSalaryByExperience[experienceBand] ?? fallbackAverage
      ),
      buildMetric(
        "children",
        `Children: ${childrenBand}`,
        "Average salary based on number of children (mock data).",
        averageSalaryByChildren[childrenBand] ?? fallbackAverage
      ),
      buildMetric(
        "ethnicity",
        `Ethnicity: ${submission.ethnicity}`,
        "Average salary by ethnicity (mock data).",
        averageSalaryByEthnicity[submission.ethnicity] ?? fallbackAverage
      ),
    ];
  }, [submission]);

  const feedbackSummary = useMemo(() => {
    if (!comparisons.length) {
      return "We need more information to generate personalised feedback.";
    }

    const positives = comparisons.filter(
      (metric) => metric.percentDifference >= 5
    );
    const negatives = comparisons.filter(
      (metric) => metric.percentDifference <= -5
    );

    const readableSubject = (metric: ComparisonMetric): string => {
      const [category, detail] = metric.label.split(":");
      const categoryText = category.trim().toLowerCase();
      const detailText = detail ? detail.trim() : "";
      return detailText ? `${categoryText} (${detailText})` : categoryText;
    };

    const sentences: string[] = [];

    if (positives.length) {
      const strongestPositive = positives.reduce((best, current) =>
        current.percentDifference > best.percentDifference ? current : best
      );
      const diff = Math.abs(strongestPositive.percentDifference).toFixed(1);
      const suffix =
        positives.length > 1
          ? " while similar gains appear in other areas"
          : "";
      sentences.push(
        `You outpace the market for ${readableSubject(
          strongestPositive
        )} by ${diff}%${suffix}.`
      );
    }

    if (negatives.length) {
      const widestGap = negatives.reduce((worst, current) =>
        current.percentDifference < worst.percentDifference ? current : worst
      );
      const diff = Math.abs(widestGap.percentDifference).toFixed(1);
      const suffix =
        negatives.length > 1
          ? " and a few related factors follow the same pattern"
          : "";
      sentences.push(
        `You're about ${diff}% below the average for ${readableSubject(
          widestGap
        )}${suffix}. Consider reviewing your development, role scope, or negotiation approach there.`
      );
    }

    const neutralCount =
      comparisons.length - positives.length - negatives.length;
    if (neutralCount > 0) {
      sentences.push(
        "Your pay sits broadly in line with the market across the remaining factors."
      );
    }

    if (!sentences.length) {
      return "Your salary is closely aligned with the market across every factor we track.";
    }

    return sentences.join(" ");
  }, [comparisons]);

  return (
    <section className="results-page" aria-live="polite">
      <header className="results-header">
        <h2>Your pay comparison</h2>
        <p>
          These insights compare your salary with market median salaries for the
          demographics you provided.
        </p>
      </header>

      <div className="results-chart">
        {comparisons.map((metric) => {
          const maxValue = Math.max(metric.user, metric.average, 1);

          return (
            <article className="chart-row" key={metric.id}>
              <header className="chart-row-header">
                <div>
                  <h3>{metric.label}</h3>
                  <p>{metric.description}</p>
                </div>
                <span
                  className="results-diff"
                  style={{
                    color: metric.percentDifference < 0 ? "#b91c1c" : "#166534",
                  }}
                >
                  {formatPercent(metric.percentDifference)}
                </span>
              </header>

              <div className="chart-bar-group">
                <ChartBar
                  label="Your salary"
                  value={metric.user}
                  maxValue={maxValue}
                  tone="user"
                />
                <ChartBar
                  label="Average"
                  value={metric.average}
                  maxValue={maxValue}
                  tone="average"
                />
              </div>
            </article>
          );
        })}
      </div>

      <section className="results-feedback">
        <h3>Your AI Feedback</h3>
        <p className="feedback-summary">{feedbackSummary}</p>
      </section>

      <div className="results-actions">
        <button type="button" className="secondary-button" onClick={onEdit}>
          Edit your answers
        </button>
      </div>
    </section>
  );
};

type ChartBarProps = {
  label: string;
  value: number;
  maxValue: number;
  tone: "user" | "average";
};

const ChartBar = ({ label, value, maxValue, tone }: ChartBarProps) => {
  const width = Math.max((value / maxValue) * 100, 4);

  return (
    <div className="chart-bar">
      <span className="chart-bar-label">{label}</span>
      <div className="chart-bar-track" aria-hidden="true">
        <div
          className={`chart-bar-fill chart-bar-${tone}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="chart-bar-value">{currencyFormatter.format(value)}</span>
    </div>
  );
};

const calculatePercentDifference = (
  userValue: number,
  averageValue: number
): number => {
  if (averageValue === 0) {
    return 0;
  }

  return ((userValue - averageValue) / averageValue) * 100;
};

const formatPercent = (value: number): string => {
  const normalized = Number.isFinite(value) ? value : 0;
  const rounded = Number(normalized.toFixed(1));
  const safeRounded = Object.is(rounded, -0) ? 0 : rounded;
  const sign = safeRounded > 0 ? "+" : "";
  return `${sign}${safeRounded.toFixed(1)}%`;
};

export default ResultsPage;
