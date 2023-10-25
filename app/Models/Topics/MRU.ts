import {MRUOperations, Operations, Topic} from "./Topic";
import {Datum} from "../Datum";
const { DateTime } = require("luxon");

interface MRUOperationsMethods {
    distancia : (equation : string) => Datum,
    velocidad : (equation : string) => Datum,
    tiempo : (equation : string) => Datum,
    posicion_inicial : (equation : string) => Datum,
    hora : (equation : string) => Datum,
    rapidez : (equation : string) => Datum,
}

class MRU extends Topic {

    constructor () {

        super();

        this.name = "MRU";
        this.equations = {
            'distancia': 'posicion_inicial + (velocidad * tiempo)',
            'velocidad': '(distancia - posicion_inicial) / tiempo',
            'tiempo': '(distancia - posicion_inicial) / velocidad',
            'posicion_inicial': '0',
            'hora': 'tiempo',
            'rapidez': '(distancia - posicion_inicial) / tiempo',
        }
    }

    processEquation(nameOfEquation : keyof MRUOperationsMethods) : Datum {
        return this[nameOfEquation]() as Datum;
    }

    // Equations

    distancia () {

        let equation : string = this.equations["distancia"] as string;

        this.data.forEach( (datum : Datum) => {
            equation = equation.replace(datum.name, datum.value);
        });

        // Get value match string
        let valueMathString : string = this.getValueMatchString(equation);

        return new Datum("distancia", valueMathString, "m");
    }

    velocidad () {

        let equation : string = this.equations["velocidad"] as string;

        this.data.forEach( (datum : Datum) => {
            equation = equation.replace(datum.name, datum.value);
        });

        // Get value match string
        let valueMathString : string = this.getValueMatchString(equation);

        return new Datum("velocidad", valueMathString, "m/s");
    }

    tiempo () {

        let equation : string = this.equations["tiempo"] as string;

        this.data.forEach( (datum : Datum) => {
            equation = equation.replace(datum.name, datum.value);
        });

        // Get value match string
        let valueMathString : string = this.getValueMatchString(equation);

        return new Datum("tiempo", valueMathString, "s");
    }

    posicion_inicial () {
        return new Datum("posicion_inicial", "0", "m");
    }

    hora () {

        let date : typeof DateTime;
        let time : number = 0;

        for(const datum of this.data) {

            if(datum.name === "fecha") {
                date = DateTime.fromISO(datum.value);
            }

            if(datum.name === "tiempo") {
                time = parseInt(datum.value);
            }
        }

        const newDate : typeof DateTime = DateTime.fromISO(date.toISO());
        newDate.plus({seconds: time});

        const difference = newDate.diff(date, ["days", "hours", "minutes", "seconds"]);
        difference.toObject();

        return new Datum("hora", `Dias: ${difference.days} - Hora: ${difference.hours}:${difference.minutes}:${difference.seconds}`, "");
    }

    rapidez () {

        let equation : string = this.equations["rapidez"] as string;

        this.data.forEach( (datum : Datum) => {
            equation = equation.replace(datum.name, datum.value);
        });

        // Get value match string
        let valueMathString : string = this.getValueMatchString(equation);

        // Add velocidad
        this.data.push(new Datum("velocidad", valueMathString, "m/s"));

        return new Datum("rapidez", valueMathString, "m/s");
    }
}

export { MRU }
