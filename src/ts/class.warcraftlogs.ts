import { validateRegion, returnURL, getURLData } from './helperFunctions';
import { LEGION_RAID_NAMES, BFA_RAID_NAMES } from './constants';

export class WarcraftlogsAPI {
  private data: any[];
  private character: string;
  private region: string;
  private realm: string;

  constructor(character: string, region: string, realm: string) {
    this.character = character;

    if (validateRegion(region)) {
      this.region = region;
    } else {
      this.region = '';
    }

    this.realm = realm;

    const RAID_NAMES = LEGION_RAID_NAMES.concat(BFA_RAID_NAMES);

    (async () => {
      this.data = [];
      const URLS: string[] = returnURL.Warcraftlogs(character, region, realm);

      URLS.forEach(async url => {
        this.data[URLS.indexOf(url)] = this.splitWarcraftlogsByDifficulty(<IWarcraftlogsAPIObject[]> await getURLData(url));

        console.log(RAID_NAMES[URLS.indexOf(url)], this.data[URLS.indexOf(url)]);
      });
    })();
  }

  splitWarcraftlogsByDifficulty = (response: IWarcraftlogsAPIObject[]) => {
    const obj: ICustomWarcraftlogsObject = {
      lfr: [],
      normal: [],
      heroic: [],
      mythic: [],
    };

    response.forEach(logData => {
      const diff = logData.difficulty;
      const cleanedUpLog = this.cleanUpLogData(logData);

      diff === 5 ? obj.mythic.push(cleanedUpLog) : diff === 4 ? obj.heroic.push(cleanedUpLog) : diff === 3 ? obj.normal.push(cleanedUpLog) : diff === 1 ? obj.lfr.push(cleanedUpLog) : void 0;
    });

    return obj;
  };

  cleanUpLogDataSpec = (specs: IWarcraftlogsAPISpecs[]) => {
    const arr: IWarcraftlogsAPICleanSpec[] = [];

    specs.forEach(originalLogSpec => {
      arr.push({
        best_allstar_points: originalLogSpec.best_allstar_points,
        best_duration: originalLogSpec.best_duration,
        best_historical_percent: originalLogSpec.best_historical_percent,
        best_talents: originalLogSpec.best_talents,
        killCount: originalLogSpec.historical_total,
        historical_avg: originalLogSpec.historical_avg,
        historical_median: originalLogSpec.historical_median,
        spec: originalLogSpec.spec,
      });
    });

    return arr;
  };

  cleanUpLogData = (logData: IWarcraftlogsAPIObject): IWarcraftlogsAPICleanObject => ({
    kill: logData.kill,
    name: logData.name,
    size: logData.size,
    specs: this.cleanUpLogDataSpec(logData.specs),
  });
}
