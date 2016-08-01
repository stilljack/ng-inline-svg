import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

import SVGCache from './svg-cache';

@Directive({
  selector: '[inlineSVG]',
  providers: [SVGCache]
})
export default class InlineSVG implements OnInit, OnChanges {
  @Input() replaceContents: boolean = true;
  @Input() cacheSVG: boolean = true;

  @Output() onSVGInserted: EventEmitter<SVGElement> = new EventEmitter<SVGElement>();

  @Input() private inlineSVG: string;

  constructor(private _el: ElementRef, private _svgCache: SVGCache) {
  }

  ngOnInit(): void {
    this._insertSVG();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inlineSVG'] && changes['inlineSVG'].currentValue !== changes['inlineSVG'].previousValue) {
      this._insertSVG();
    }
  }

  private _insertSVG(): void {
    if (!this.inlineSVG) {
      console.error('No URL passed to [inlineSVG]!');
      return;
    }

    this._svgCache.getSVG(this.inlineSVG, this.cacheSVG)
      .then((svg: SVGElement) => {
        if (svg && this._el.nativeElement) {
          if (this.replaceContents) {
            this._el.nativeElement.innerHTML = '';
          }

          this._el.nativeElement.appendChild(svg);
          this.onSVGInserted.emit(svg);
        }
      })
      .catch((err: any) => console.error(err));
  }
}
