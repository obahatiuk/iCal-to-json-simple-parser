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

        this.background = '#e0dcd9';
    }

    @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        this.background = '#eee';
    }

    @HostListener('drop', ['$event']) onDropFile(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        this.fileChangeEmitter.emit(evt.dataTransfer);
    }
}