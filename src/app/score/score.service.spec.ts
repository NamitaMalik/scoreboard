import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ScoreService } from './score.service';
import { skip } from 'rxjs/operators';
import { of } from 'rxjs';

let service: ScoreService;

describe('ScoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ScoreService);
    service.setFrames({});
  });

  it('is created', () => {
    expect(service).toBeTruthy();
  });

  describe('getGameData', () => {
    it('returns all the frames submitted in a game', () => {
      service.getGameData().pipe(skip(2)).subscribe((game => {
        expect(game.frames).toEqual([{ first: 10, second: 0 }, { first: 5, second: 2 }]);
      }));
      service.setFrames({ first: 10, second: 0 });
      service.setFrames({ first: 5, second: 2 });
    });
  });

  describe('calculateScore', () => {
    it('returns the game score', () => {
      service.calculateScore(of({
        frames: [
          { first: 3, second: 4 },
          { first: 4, second: 5 }
        ]
      })).subscribe(score => expect(score).toBe(16));
      service.calculateScore(of({
        frames: [
          { first: 3, second: 4 },
          { first: 6, second: 4 },
          { first: 6, second: 2 }
        ]
      })).subscribe(score => expect(score).toBe(31));
      service.calculateScore(of({
        frames: [
          { first: 3, second: 4 },
          { first: 10, second: 0 },
          { first: 6, second: 2 }
        ]
      })).subscribe(score => expect(score).toBe(33));
      service.calculateScore(of({
        frames: [
          { first: 3, second: 4 },
          { first: 10, second: 0 },
          { first: 10, second: 0 },
          { first: 6, second: 2 }
        ]
      })).subscribe(score => expect(score).toBe(53));
      service.calculateScore(of({
        frames: [
          { first: 3, second: 7 },
          { first: 1, second: 0 },
          { first: 10, second: 0 },
          { first: 6, second: 2 },
          { first: 6, second: 4 },
          { first: 6, second: 2 },
          { first: 1, second: 2 },
          { first: 1, second: 0 },
          { first: 1, second: 0 },
          { first: 1, second: 2, third: 3 }
        ]
      })).subscribe(score => expect(score).toBe(73));
    });
    it('throws error when sum of 2 rolls is greater than 10', () => {
      service.calculateScore(of({
        frames: [
          { first: 4, second: 7 },
          { first: 1, second: 0 },
          { first: 10, second: 0 },
          { first: 6, second: 2 },
          { first: 6, second: 4 },
          { first: 6, second: 2 },
          { first: 1, second: 2 },
          { first: 1, second: 0 },
          { first: 1, second: 0 },
        ]
      }))
        .subscribe(() => {}, (error: Error) => {
          expect(error).toEqual(new Error('Wrong Input'));
        });
    });
  });

  describe('getScore', () => {
    it('returns score', () => {
      service.setFrames({ first: 5, second: 2 });
      service.getScore().subscribe(scoreData => expect(scoreData).toEqual({ score: 7 }));
    });
  });

  describe('disableRoll', () => {
    it('returns true if 10 frames have been submitted', () => {
      service.disableRoll().pipe(skip(10)).subscribe(disableRoll => {
        expect(disableRoll).toBe(true);
      });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
    });
    it('returns false if less than 10 frames have been submitted', () => {
      service.disableRoll().subscribe(disableRoll => {
        expect(disableRoll).toBe(false);
      });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
    });
  });

  describe('hasThreeRolls', () => {
    it('returns true when 9 frames have been submitted and 10 was score in first roll of first frame', () => {
      service.hasThreeRolls().pipe(skip(9)).subscribe(hasThreeFrames => expect(hasThreeFrames).toBe(true));
      service.setFrames({ first: 10, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
    });
    it('returns true when 9 frames have been submitted and some of first roll and second roll was 10 in first frame', () => {
      service.hasThreeRolls().pipe(skip(9)).subscribe(hasThreeFrames => expect(hasThreeFrames).toBe(true));
      service.setFrames({ first: 5, second: 5 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
    });
    it('returns false when less than 9 frames have been submitted and some of first roll and second roll was 10 in first frame', () => {
      service.hasThreeRolls().pipe(skip(8)).subscribe(hasThreeFrames => expect(hasThreeFrames).toBe(false));
      service.setFrames({ first: 5, second: 5 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
    });
    it('returns false when less than 9 frames have been submitted and some of first roll and second roll was 10 in first frame', () => {
      service.hasThreeRolls().pipe(skip(8)).subscribe(hasThreeFrames => expect(hasThreeFrames).toBe(false));
      service.setFrames({ first: 10, second: 0});
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
    });
    it('returns false when 9 frames have been submitted and sum of first roll and second roll is less than 10', () => {
      service.hasThreeRolls().pipe(skip(9)).subscribe(hasThreeFrames => expect(hasThreeFrames).toBe(false));
      service.setFrames({ first: 4, second: 3});
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
      service.setFrames({ first: 5, second: 0 });
    });
  });
});
