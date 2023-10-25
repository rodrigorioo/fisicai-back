import {Topic} from "./Topic";
import {Datum} from "../Datum";

interface MRUVOperationsMethods {
    velocidad_inicial : (equation : string) => Datum,
    velocidad_final : (equation : string) => Datum,
    tiempo_inicial : (equation : string) => Datum,
    tiempo_final : (equation : string) => Datum,
    tiempo : (equation : string) => Datum,
    posicion_final : (equation : string) => Datum,
    posicion : (equation : string) => Datum,
    aceleracion: (equation : string) => Datum,
}

class MRUV extends Topic {

    constructor () {

        super();

        this.name = "MRUV";
        this.equations = {
            'velocidad_inicial': '0',
            'velocidad_final': 'velocidad_inicial + (aceleracion * tiempo)',
            'velocidad': 'velocidad_inicial + (aceleracion * tiempo)',

            'rapidez': 'velocidad_inicial + (aceleracion * tiempo)',

            'tiempo_inicial': '0',
            'tiempo_final': '0',
            'tiempo': '(velocidad - velocidad_inicial) / aceleracion',

            'posicion_final': 'posicion_inicial + (velocidad_inicial * tiempo) + ( (aceleracion * (tiempo * tiempo)) / 2)',
            'posicion_inicial': '0',
            'posicion': 'posicion_inicial + (velocidad_inicial * tiempo) + ( (aceleracion * (tiempo * tiempo)) / 2)',

            'aceleracion': '(velocidad - velocidad_inicial) / (tiempo - tiempo_inicial)',
        }
    }

    processEquation(nameOfEquation : keyof MRUVOperationsMethods) : Datum {
        return this[nameOfEquation]() as Datum;
    }

    // Equations

    velocidad_inicial () : Datum {
        return new Datum("velocidad_inicial", "0", "m/s");
    }

    velocidad_final () : Datum {

        let equation : string = this.equations["velocidad_final"] as string;

        this.data.forEach( (datum : Datum) => {
            equation = equation.replace(datum.name, datum.value);
        });

        // Get value match string
        let valueMathString : string = this.getValueMatchString(equation);

        return new Datum("velocidad_final", valueMathString, "m/s");
    }

    velocidad () : Datum {

        let equation : string = this.equations["velocidad"] as string;

        this.data.forEach( (datum : Datum) => {
            equation = equation.replace(datum.name, datum.value);
        });

        // Get value match string
        let valueMathString : string = this.getValueMatchString(equation);

        // Add velocidad final
        this.data.push(new Datum("velocidad_final", valueMathString, "m/s"));

        return new Datum("velocidad", valueMathString, "m/s");
    }

    rapidez () : Datum {

        let equation : string = this.equations["rapidez"] as string;

        this.data.forEach( (datum : Datum) => {
            equation = equation.replace(datum.name, datum.value);
        });

        // Get value match string
        let valueMathString : string = this.getValueMatchString(equation);

        // Add velocidad
        this.data.push(new Datum("velocidad", valueMathString, "m/s"));

        // Add velocidad final
        this.data.push(new Datum("velocidad_final", valueMathString, "m/s"));

        return new Datum("rapidez", valueMathString, "m/s");
    }

    tiempo_inicial () : Datum {
        return new Datum("tiempo_inicial", "0", "s");
    }

    tiempo_final () : Datum {
        return new Datum("tiempo_final", "0", "s");
    }

    tiempo () : Datum {

        let equation : string = this.equations["tiempo"] as string;

        this.data.forEach( (datum : Datum) => {
            equation = equation.replace(datum.name, datum.value);
        });

        // Get value match string
        let valueMathString : string = this.getValueMatchString(equation);

        return new Datum("tiempo", valueMathString, "s");
    }

    aceleracion () : Datum {

        let equation : string = this.equations["aceleracion"] as string;

        this.data.forEach( (datum : Datum) => {
            equation = equation.replace(datum.name, datum.value);
        });

        // Get value match string
        let valueMathString : string = this.getValueMatchString(equation);

        return new Datum("aceleracion", valueMathString, "m/s2");
    }

    posicion_inicial () : Datum {
        return new Datum("posicion_inicial", "0", "m");
    }

    posicion_final () : Datum {
        return new Datum("posicion_final", "0", "m");
    }

    posicion () : Datum {
        return new Datum("posicion", "0", "m");
    }

}

export { MRUV }
