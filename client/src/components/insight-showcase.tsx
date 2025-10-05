import { TypographyP } from "./ui/typographyP";

export interface Insights {
  generatedOn: Date;
  
}

export interface Output {
  customer_demand: string;
	weather: string;
	traffic: string;
	incentives: string;
}

function InsightsDataShowcase({ examples, index }: { examples: Output[], index: number }) {
	const example = examples[index];
	if (!example) return null;

	return (
		<div className="p-4 border rounded-2xl shadow-sm space-y-2">
			<TypographyP text={example.customer_demand} />
			<TypographyP text={example.weather} />
			<TypographyP text={example.traffic} />
			<TypographyP text={example.incentives} />
		</div>
	);
}

export default InsightsDataShowcase;
