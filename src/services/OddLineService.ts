import { getRepository, Repository } from 'typeorm';

import OddLine from '../models/OddLine';

import footballApi from '../config/footballApi';
import FixtureService from './FixtureService';

interface ApiOdds {
  value: string;
  odd: string;
}

interface OfferOdds {
  fixture_id: string;
  homeLineBase: string;
  oddHomeBase: string;
  awayLineBase: string;
  oddAwayBase: string;
}

interface DeleteOdds {
  fixture_id: string;
}

class OddLineService {
  oddLineRepository: Repository<OddLine>;

  constructor() {
    this.oddLineRepository = getRepository(OddLine);
  }

  public async find(fixture_id: string): Promise<OddLine[]> {
    const odds = await this.oddLineRepository.find({
      fixture_id,
    });

    return odds;
  }

  public async findByHomeLine(
    line: string,
    fixture_id: string,
  ): Promise<OddLine> {
    const odd = await this.oddLineRepository.findOne({
      homeLine: line,
      fixture_id,
    });

    return odd;
  }

  public async create(fixture_id: string): Promise<OddLine[]> {
    const odds = [];

    const oddsFromApi = await this.getOddsFromApi(fixture_id);

    if (oddsFromApi) {
      for (let index = 0; index < oddsFromApi.length; index++) {
        const odd = oddsFromApi[index];

        const existsLine = odds.filter(o => {
          let oppositeLine;

          if (odd.value.toLowerCase().includes('home')) {
            oppositeLine = odd.value.replace('Home', 'Away');

            return oppositeLine === o.awayLine;
          }

          if (odd.value.toLowerCase().includes('away')) {
            oppositeLine = odd.value.replace('Away', 'Home');

            return oppositeLine === o.homeLine;
          }

          return [];
        });

        if (
          existsLine.length > 0 &&
          (!existsLine[0].homeLine || !existsLine[0].awayLine)
        ) {
          const line = odd.value.substring(0, 4);
          const numberLine =
            Number(odd.value.substring(5, odd.value.length)) * -1;

          /* eslint-disable */
          existsLine[0].awayLine = `${line} ${numberLine >= 0 ? '+' : ''}${numberLine}`;
          existsLine[0].oddAway = Number(odd.odd).toFixed(2);
          /*eslint-disable*/
          existsLine[0].oddDiff = this.roundNumber(
            Math.abs(2 - Number(odd.odd)) +
            Math.abs(2 - Number(existsLine[0].oddHome)),
          );
          /* eslint-enable */
        } else {
          const newOdd = {
            fixture_id,
            homeLine: odd.value.toLowerCase().includes('home')
              ? odd.value
              : null,
            oddHome: odd.value.toLowerCase().includes('home')
              ? Number(odd.odd).toFixed(2)
              : null,
            awayLine: odd.value.toLowerCase().includes('away')
              ? odd.value
              : null,
            oddAway: odd.value.toLowerCase().includes('away') ? odd.odd : null,
          };

          odds.push(newOdd);
        }
      }
    }

    await this.oddLineRepository.save(odds);

    return this.find(fixture_id);
  }

  public async update(fixture_id: string): Promise<OddLine[]> {
    const odds = await this.find(fixture_id);

    for (let index = 0; index < odds.length; index++) {
      const odd = odds[index];
      await this.oddLineRepository.delete({ id: odd.id });
    }

    return this.create(fixture_id);
  }

  public async createOfferOdd(offerOdds: OfferOdds[]): Promise<void> {
    const newOdds = [];

    for (let index = 0; index < offerOdds.length; index++) {
      const offerOdd = offerOdds[index];

      const signalHome = Number(offerOdd.homeLineBase) >= 0 ? '+' : '';
      const signalAway = Number(offerOdd.awayLineBase) >= 0 ? '+' : '';

      const homeNumberIsInteger =
        offerOdd.homeLineBase === '0.00' ||
        offerOdd.homeLineBase === '1.00' ||
        offerOdd.homeLineBase === '-1.00';

      const awayNumberIsInteger =
        offerOdd.awayLineBase === '0.00' ||
        offerOdd.awayLineBase === '1.00' ||
        offerOdd.awayLineBase === '-1.00';

      const homeLineNumber = homeNumberIsInteger
        ? parseInt(offerOdd.homeLineBase, 10)
        : offerOdd.homeLineBase;

      const awayLineNumber = awayNumberIsInteger
        ? parseInt(offerOdd.awayLineBase, 10)
        : offerOdd.awayLineBase;

      console.log(homeLineNumber);

      const homeLine = `Home ${signalHome}${homeLineNumber}`;
      const oddHome = offerOdd.oddHomeBase;
      const awayLine = `Away ${signalAway}${awayLineNumber}`;
      const oddAway = offerOdd.oddAwayBase;
      const oddDiff = Math.abs(Number(oddHome) - Number(oddAway)).toFixed(2);

      const existsOdds = await this.findByHomeLine(
        homeLine,
        offerOdd.fixture_id,
      );

      if (!existsOdds) {
        console.log('não existe');
        const newOdd = {
          fixture_id: offerOdd.fixture_id,
          homeLine,
          oddHome,
          awayLine,
          oddAway,
          oddDiff,
          manually: true,
        };

        newOdds.push(newOdd);
      } else {
        console.log('existe');

        existsOdds.oddHome = oddHome;
        existsOdds.oddAway = oddAway;
        existsOdds.oddDiff = oddDiff;

        this.oddLineRepository.save(existsOdds);
      }
    }

    this.oddLineRepository.save(newOdds);
  }

  public async deleteOfferOdd(offerOdds: DeleteOdds[]): Promise<void> {
    for (let j = 0; j < offerOdds.length; j++) {
      const offerOdd = offerOdds[j];
      const odds = await this.find(offerOdd.fixture_id);

      for (let index = 0; index < odds.length; index++) {
        const odd = odds[index];
        await this.oddLineRepository.delete({ id: odd.id });
      }
    }
  }

  public async getOddsFromApi(fixture_id: string): Promise<ApiOdds[]> {
    const fixtureService = new FixtureService();
    const fixture = await fixtureService.findById(fixture_id);

    if (fixture) {
      let odds = [];

      const oddsResponse = await footballApi.get(`/odds`, {
        params: {
          fixture: Number(fixture.integration_id),
          timezone: 'America/Sao_Paulo',
        },
      });

      if (oddsResponse.data.response.length > 0) {
        const pinnacleOdds = oddsResponse.data.response[0].bookmakers.filter(
          bm => bm.id === 4,
        );

        if (pinnacleOdds.length > 0) {
          const asianOdds = pinnacleOdds[0].bets.filter(
            bet => bet.name === 'Asian Handicap',
          );

          odds =
            asianOdds.length > 0 && asianOdds[0].values.length > 0
              ? asianOdds[0].values
              : [];
        }

        return odds;
      }
    }

    return null;
  }

  private roundNumber(number: number): number {
    return Math.round(number * 100) / 100;
  }
}

export default OddLineService;
