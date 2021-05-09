import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NotepadService } from 'src/app/services/notepad.service';

/**
 * @title Chips Autocomplete
 */
@Component({
    selector: 'user-autocomplete',
    templateUrl: 'user-autocomplete.component.html',
    styleUrls: ['user-autocomplete.component.less']
})
export class UserAutocompleteComponent {
    visible = true;
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    sharedControl = new FormControl();
    filteredUsers: Observable<string[]>;

    allUsers: string[] = [];
    selectedUser: string[] = [];

    @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;

    constructor(
        public notepadService: NotepadService,
    ) {
        this.notepadService.getUsers().then(result => {
            result.forEach(user => {
                this.allUsers.push(user.email);
            })
            this.filteredUsers = this.sharedControl.valueChanges.pipe(
                startWith(null),
                map((user: string | null) => user ? this._filter(user) :
                    this.allUsers.filter(users => { return !this.selectedUser.includes(users) }).slice()));
        });
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add our user
        if ((value || '').trim()) {
            let validUser = this.allUsers.filter(user => { return !this.selectedUser.includes(user) })
            if (validUser.includes(value.trim())) {
                this.selectedUser.push(value.trim());
            }
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }

        this.sharedControl.setValue(null);
    }

    remove(user: string): void {
        const index = this.selectedUser.indexOf(user);

        if (index >= 0) {
            this.selectedUser.splice(index, 1);
            this.sharedControl.setValue(null);
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        if (event.option.viewValue && !this.selectedUser.includes(event.option.viewValue)) {
            this.selectedUser.push(event.option.viewValue);
        }
        this.userInput.nativeElement.value = '';
        this.sharedControl.setValue(null);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        let validUser = this.allUsers.filter(user => { return !this.selectedUser.includes(user) })
        return validUser.filter(user => user.toLowerCase().indexOf(filterValue) === 0);
    }

    onOpenAutocomplete() {
        if (!this.sharedControl.value) {
            this.sharedControl.setValue(null);
        }
    }
}
