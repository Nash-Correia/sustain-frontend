export interface TooltipInfo {
  title: string;
  description: string;
}

export const tooltipData: Record<string, TooltipInfo> = {
  esgCompositeScore: {
    title: "ESG Composite Score",
    description: "The ESG Composite Score is a final, comprehensive assessment that incorporates the sector-weighted E, S, and G pillar scores, positive and negative screens, and any controversy ratings.",
  },
  topPerformer: {
    title: "Top ESG Performer",
    description: "The company with the highest ESG Composite Score within the selected group (e.g., the entire universe, a specific fund, or a peer group).",
  },
  needsImprovement: {
    title: "Needs Improvement",
    description: "The company with the lowest ESG Composite Score within the selected group, indicating areas that require attention.",
  },
  sectoralAverage: {
    title: "Sectoral Average Performance",
    description: "The average ESG Composite Score for all companies within a specific sector. This provides a benchmark for comparing individual company performance.",
  },
  environmentalPillar: {
    title: "Environmental Pillar Score",
    description: "Covers a company's use of resources, steps taken to control emissions, decarbonization, reduction in carbon footprint, energy and water consumption, improvement in circularity, and biodiversity.",
  },
  socialPillar: {
    title: "Social Pillar Score",
    description: "Covers workforce well-being and diversity, the company's relationship with all its stakeholders, and whether it contributes meaningfully to being a responsible citizen.",
  },
  governancePillar: {
    title: "Governance Pillar Score",
    description: "Evaluates whether the company follows sound corporate governance practices and ensures that all stakeholder rights are protected.",
  },
  esgPillarScore: {
    title: "ESG Pillar Score",
    description: "A sector-weighted score calculated from the individual Environmental, Social, and Governance pillars before applying screens and controversy overlays."
  },
  positiveScreen: {
    title: "Positive Screen",
    description: "Measures a company's alignment and commitment to global standards and principles, such as the UN Sustainable Development Goals (SDGs). Adherence indicates an integration of sustainability into operations.",
  },
  negativeScreen: {
    title: "Negative Screen",
    description: "Measures the impact of a company's products or activities on society. A deflator is applied for companies operating in exclusionary 'Sin' or 'Polluting' sectors.",
  },
  controversyRating: {
    title: "Controversy Rating",
    description: "Captures a company's involvement in incidents with a negative ESG impact. Controversies are reviewed on a dynamic basis with a three-year look-back period and scored by severity (None, Moderate, Serious, Severe).",
  },
  esgRating: {
    title: "ESG Rating",
    description: "The final letter grade assigned based on the ESG Composite Score. It reflects a company's relative ESG performance and risk profile, with A+ representing leadership and D indicating nascent practices.",
  },
};

