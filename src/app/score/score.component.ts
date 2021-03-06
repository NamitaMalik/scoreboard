import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ScoreService } from './score.service';
import { Observable, Subscription } from 'rxjs';
import { scoreInputValidator } from '../validators/score-input.validator';
import { Game } from './score.model';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreComponent implements OnInit, OnDestroy {
  form: FormGroup;
  displayThird = false;
  score$: Observable<{ score: number }>;
  disableRoll$: Observable<boolean>;
  subscription = new Subscription();

  constructor(private _fb: FormBuilder, private _scoreService: ScoreService) {}

  ngOnInit(): void {
    this.form = this.buildForm();
    this.score$ = this._scoreService.getScore();
    this.disableRoll$ = this._scoreService.disableRoll();
    this.subscription.add(
      this._scoreService.hasThreeRolls().subscribe((displayThird) => {
        if (displayThird) {
          this.displayThird = displayThird;
          this.addThirdControl();
        }
      })
    );
    this.subscription.add(this._scoreService.getGameData().subscribe( (game: Game) => {
      if (game.frames.length === 9) {
        this.form.setValidators([]);
      }
    }));
  }

  buildForm(): FormGroup {
    return this._fb.group(
      {
        first: [
          undefined,
          [Validators.required, Validators.min(0), Validators.max(10)],
        ],
        second: [
          undefined,
          [Validators.required, Validators.min(0), Validators.max(10)],
        ],
      },
      { emitEvent: false, validators: scoreInputValidator }
    );
  }

  addThirdControl(): void {
    this.form.addControl(
      'third',
      new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(10),
      ])
    );
  }

  submitFrames(): void {
    this._scoreService.setFrames(
      this.form.get('third')
        ? {
            first: this.form.get('first').value,
            second: this.form.get('second').value,
            third: this.form.get('third').value,
          }
        : {
            first: this.form.get('first').value,
            second: this.form.get('second').value,
          }
    );
    this.form.reset();
  }

  resetScore(): void {
    this._scoreService.setFrames({});
    if (this.form.get('third')) {
      this.form.removeControl('third');
    }
    this.displayThird = false;
    this.form.setValidators(scoreInputValidator);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
