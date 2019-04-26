import { Directive, HostListener, Input, EventEmitter, Output, HostBinding } from "@angular/core";

@Directive({
    selector: "[drag-and-drop-file]"
})
export class DragAndDropFileDirective {

    @HostBinding('style.background') private background = '#eee';

    @Output() private fileChangeEmitter: EventEmitter<File[]> = new EventEmitter();

    @HostListener('dragover', ['$event']) public onDragOver(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        this.background = '#999';
    }

    @HostListener('drop', ['$event']) onDropFile(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        this.fileChangeEmitter.emit(evt.dataTransfer);
    }
}