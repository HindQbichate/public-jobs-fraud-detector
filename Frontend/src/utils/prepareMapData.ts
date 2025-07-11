import { regionIdToNameLegacy } from './regionMap';

export function prepareLegacyRegionFraudStats(apiData: any[]) {
  const result: Record<string, { fraudCount: number; total: number }> = {};

  for (const item of apiData) {
    const regionFromAPI = item.Application.ImportedTender.region;

    const regionId = Object.entries(regionIdToNameLegacy).find(
      ([, legacyName]) => legacyName === regionFromAPI
    )?.[0];

    if (!regionId) continue;

    if (!result[regionId]) {
      result[regionId] = { fraudCount: 0, total: 0 };
    }

    result[regionId].total += 1;
    if (item.prediction === true) {
      result[regionId].fraudCount += 1;
    }
  }

  return result;
}
