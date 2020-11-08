import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreComponent } from './score.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScoreService } from './score.service';
import { of } from 'rxjs';

describe('ScoreComponent', () => {
  let component: ScoreComponent;
  let fixture: ComponentFixture<ScoreComponent>;
  let service: ScoreService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreComponent ],
      imports: [ReactiveFormsModule],
      providers: [ScoreService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreComponent);
    component = fixture.componentInstance;
    service = TestBed.get(ScoreService);
    component.form = component.buildForm();
    fixture.detectChanges();
  });

  it('is created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('initializes form', () => {
     expect(component.form.controls.first).toBeDefined();
     expect(component.form.controls.second).toBeDefined();
    });

    it('initializes score', () => {
      expect(component.score$).toBeDefined();
    });

    it('subscribes to hasThreeRolls', () => {
      spyOn(service, 'hasThreeRolls').and.returnValue(of(false));
      component.ngOnInit();
      expect(service.hasThreeRolls).toHaveBeenCalled();
    });

    it('sets displayThird', () => {
      spyOn(service, 'hasThreeRolls').and.returnValue(of(true));
      component.ngOnInit();
      expect(component.displayThird).toBe(true);
    });
  });

  describe('buildForm', () => {
    it('returns form group', () => {
      expect(component.buildForm().contains('first')).toBe(true);
      expect(component.buildForm().contains('second')).toBe(true);
    });
  });

  describe('addThirdControl', () => {
    it('adds third control to form', () => {
      expect(component.form.contains('third')).toBe(false);
      component.addThirdControl();
      expect(component.form.contains('third')).toBe(true);
    });
  });

  describe('submitFrames', () => {
    it('calls setFrames on score service to submit score of first and second roll', () => {
      spyOn(service, 'setFrames');
      component.submitFrames();
      expect(service.setFrames).toHaveBeenCalledWith({
        first: component.form.get('first').value,
        second: component.form.get('second').value,
      });
    });
    it('calls setFrames on score service to submit score of first, second and third frame', () => {
      spyOn(service, 'setFrames');
      const fb = new FormBuilder();
      component.form = fb.group(
        {
          first: [
            undefined,
            [Validators.required, Validators.min(0), Validators.max(10)],
          ],
          second: [
            undefined,
            [Validators.required, Validators.min(0), Validators.max(10)],
          ],
          third: [
            undefined,
            [Validators.required, Validators.min(0), Validators.max(10)],
          ],
        });
      component.submitFrames();
      expect(service.setFrames).toHaveBeenCalledWith({
        first: component.form.get('first').value,
        second: component.form.get('second').value,
        third: component.form.get('third').value,
      });
    });
  });

  describe('resetScore', () => {
    it('resets frame to empty object', () => {
      spyOn(service, 'setFrames');
      component.resetScore();
      expect(service.setFrames).toHaveBeenCalledWith({});
    });

    it('removes  third control from frame', () => {
      const fb = new FormBuilder();
      component.form = fb.group(
        {
          first: [
            undefined,
            [Validators.required, Validators.min(0), Validators.max(10)],
          ],
          second: [
            undefined,
            [Validators.required, Validators.min(0), Validators.max(10)],
          ],
          third: [
            undefined,
            [Validators.required, Validators.min(0), Validators.max(10)],
          ],
        });
      spyOn(component.form, 'removeControl');
      component.resetScore();
      expect(component.form.removeControl).toHaveBeenCalledWith('third');
    });
    it('sets displayThird to false', () => {
      component.displayThird = true;
      component.resetScore();
      expect(component.displayThird).toEqual(false);
    });
  });
});
