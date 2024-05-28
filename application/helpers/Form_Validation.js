const { util_string } = require('../../system/utilities/Framework_Utils'); 

class Form_Validation {
    constructor() {
        this.util_string = util_string;
        // this.alphabets = {a:'a', b:'b',c:'c', d:'d', e:'e', f:'f', g:'g', h:'h', i:'i', g:'g', k:'k', l:'l', m:'m', n:'n', o:'o', p:'p', q:'q', r:'r', s:'s', t:'t', u:'u', v:'v', w:'w', x:'x', y:'y', z:'z'}
        this.validationResult = [];
        this.field = "";
        this.label = "";

    }
    set_rules(field, label, validation) {
        this.field = field;
        this.label = label;
        const set_rules= this.util_string.splitStr(validation,'|');

        for(let i=0; i < set_rules.length; i++){
            if(set_rules[i] == 'trim' && typeof field === 'string') {
                this.trim();
            } 
            if(set_rules[i] == 'required') {
                this.required();
            }
            if(set_rules[i][0]+set_rules[i][1]+set_rules[i][2] == 'max' && this.field.length !== 0) {
                this.max_length(set_rules[i]);
            }
            if(set_rules[i][0]+set_rules[i][1]+set_rules[i][2] == 'min' && this.field.length !== 0) {
                this.min_length(set_rules[i]);
            }
            if(set_rules[i][0]+set_rules[i][1]+set_rules[i][2]+set_rules[i][3]+set_rules[i][4] == 'match' && this.field.length !== 0) {
                this.matches(set_rules[i]);
            }
            if(set_rules[i] == 'valid_email' && this.field.length !== 0) {
                this.validate_email();
            }
            if(set_rules[i] == 'alpha' && this.field.length !== 0)  {
                this.alpha();
            }
            if(set_rules[i] == 'integer' && this.field.length !== 0) {
                this.integer();
            }
        }
    }

    trim() {
        this.field.trim();
    }

    required() {
        const msg = `The ${this.label} field is required!`;
        if(this.field == "") {
            this.validationResult.push(msg);
        }
    }

    max_length(rules) {
        const indexLength = [this.util_string.fetchlastIndex(rules,'['), this.util_string.fetchlastIndex(rules,']')];
        let value = "";
        for(let i=indexLength[0]+1; i < indexLength[1]; i++){
            value += rules[i];
        }
        const length = Number(value);
        const msg = `${this.label} field exceed max ${length} characters allowed!`;
        if(this.field.length > length) {
            this.validationResult.push(msg);
        }
    }

    min_length(rules) {
        const indexLength = [this.util_string.fetchlastIndex(rules,'['), this.util_string.fetchlastIndex(rules,']')];
        let value = "";
        for(let i=indexLength[0]+1; i < indexLength[1]; i++){
            value += rules[i];
        }
        const length = Number(value);
        const msg = `${this.label} field should have atleast ${length} characters!`;
        if(this.field.length < length) {
            this.validationResult.push(msg);
            return;
        }
    }

    matches(rules) {
        const msg = `Invalid credentials!`;
        const indexLength = [this.util_string.fetchlastIndex(rules,'['), this.util_string.fetchlastIndex(rules,']')];
        let value = "";
        for(let i=indexLength[0]+1; i < indexLength[1]; i++){
            value += rules[i];
        }
        if(this.field !== value) {
            this.validationResult.push(msg);
            return;
        }
    }

    alpha() {
        const msg = `${this.label} field must only contains letters!`;
        const lettersOnly = /^[a-zA-Z\s]+$/;
        for(let i=0; i < this.field.length; i++) {
            if (!lettersOnly.test(this.field[i])) {
                this.validationResult.push(msg);
                return;
            }
        }
    }

    integer() {
        const msg = `${this.label} field must only contains numbers!`;
        const letters = /^[a-zA-Z]+$/;
        for(let i=0; i < this.field.length; i++) {
            if (letters.test(this.field[i])) {
                this.validationResult.push(msg);
                return;
            }
        }
    }

    validate_email() {
        const msg = `The ${this.label} field is not a valid email!`;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(this.field)) {
            this.validationResult.push(msg);
        }
    }

    run() {
        const result = this.validationResult;
        this.validationResult = [];
        return result;
    }
}


module.exports = new Form_Validation;
