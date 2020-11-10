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

  calculateScore(gameData: Observable<Game>): Observable<{ score: number }>  {
    return gameData.pipe(
      map((game) => {
        let isFirstStrikeOrSpare = false;
        let score = 0;
        const frames = game.frames;
        frames.forEach((frame, index) => {
          if (frame.first + frame.second > 10 && frames.length !== 10) {
            throw new Error('Wrong Input');
          }

          const isStrike = frame.first === 10;
          const isSpare = frame.first + frame.second === 10;

          score += frame.first + frame.second;
          if (index === 0) {
            isFirstStrikeOrSpare = isStrike || isSpare;
          } else {
            const lastFrame = frames[index - 1];
            if (lastFrame.first === 10) {
              score += frame.first + frame.second;
              if (index - 2 >= 0) {
                const secondLastFrame = frames[index - 2];
                if (secondLastFrame.first === 10) { score += frame.first; }
              }
            } else if (lastFrame.first + lastFrame.second === 10) {
              score += frame.first;
            }
          }

          if (index === 9 && isFirstStrikeOrSpare) {
            score += frame.third;
          }
        });
        return { score };
      })
    );
  }

  getScore(): Observable<{ score: number }> {
    return this.calculateScore(this.getGameData());
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
