import { Injectable } from '@angular/core';
import { Frame, Game } from './score.model';
import { BehaviorSubject, Observable, pipe, Subject } from 'rxjs';
import { map, scan, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  private _frames = new BehaviorSubject({});

  setFrames(val): void {
    this._frames.next(val);
  }

  getGameData(): Observable<Game> {
    return this._frames
      .pipe(scan<Frame>((acc, curr) => {
        return JSON.stringify(this._frames.value) === '{}' ? [] : [...acc, curr];
      }, []))
      .pipe(map((frames) => ({ frames })));
  }

  calculateScore(game: Observable<Game>): Observable<number>  {
    return game.pipe(
      map((frames) => {
        let isFirstStrikeOrSpare = false;
        let score = 0;
        let isLastStrike = false;
        let isLastSpare = false;
        frames.frames.forEach((frame, index) => {
          if (frame.first + frame.second > 10 && frames.frames.length !== 10) {
            throw new Error('Wrong Input');
          }

          if (isLastStrike) {
            score += frame.first + frame.second;
          } else if (isLastSpare) {
            score += frame.first;
          }
          isLastStrike = isLastSpare = false;

          if (
            index === 0 &&
            (frame.first === 10 || frame.first + frame.second === 10)
          ) {
            isFirstStrikeOrSpare = true;
          }
          if (index === 9) {
            score += frame.first + frame.second + frame.third;
          } else {
            score += frame.first + frame.second;
          }

          if (frame.first === 10) {
            isLastStrike = true;
          }
          if (frame.first + frame.second === 10) {
            isLastSpare = true;
          }
        });
        return score;
      })
    );
  }

  getScore(): Observable<{ score: number }> {
    return this.calculateScore(this.getGameData()).pipe(map(score => ( { score })));
  }

  disableRoll(): Observable<boolean> {
    return this.getGameData().pipe(map(frames => frames.frames.length > 9));
  }

  hasThreeRolls(): Observable<boolean> {
    return this.getGameData().pipe(map(game => {
      return game.frames.length === 9 &&
        (game.frames[0].first === 10 ||
          game.frames[0].first + game.frames[0].second === 10);
    }));
  }
}
