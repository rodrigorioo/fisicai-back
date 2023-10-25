import {Entity, Wit} from "./Wit";

type LoadEntityReturn = Promise<Datum> | Promise<Array<Entity>>;

class Datum {

    name : string = "";
    value : string = "";
    unit : string = "";

    constructor (name?: string, value?: string, unit?: string) {

        this.name = (name) ? name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "_") : "";
        this.value = (value) ? value : "";
        this.unit = (unit) ? unit : "";

        // Parse Unit
        this.parseUnit();
    }

    /**
     *
     * @param entity
     */
    loadEntity (entity: Entity): LoadEntityReturn {

        return new Promise<any>( async (success, failure) => {

            switch (entity.name) {

                case "valor":

                    this.name = this.getName(this.getUnit(entity.value));
                    this.value = this.getValue(entity.value);
                    this.unit = this.getUnit(entity.value);

                    break;

                case "wit$distance":

                    this.name = "distancia";
                    this.value = entity.value;
                    this.unit = this.unitTranslate(entity.unit);

                    break;

                case "wit$duration":

                    this.name = "tiempo";
                    this.value = entity.value;
                    this.unit = this.unitTranslate(entity.unit);

                    break;

                case "wit$datetime":

                    // Wit detects "EN UN SEGUNDO" like a DateTime
                    // For fix this we remove all ancestor words, and we send this new value to Wit for extract the time
                    if(entity.grain === "second") {

                        // Create new value to send
                        const newValue = entity.body.replace(/(en)/, "");

                        // Init Wit
                        let wit : Wit;

                        try {
                            wit = new Wit();
                        } catch (e : any) {
                            return failure(e.message);
                        }

                        // Process message
                        await wit.processMessage(newValue).catch( (errProcessMessage : Error) => {
                            return failure(errProcessMessage.message);
                        });

                        return success(wit.entities);

                    } else {

                        this.name = "fecha";
                        this.value = entity.value;
                        this.unit = "";

                    }

                    break;

                default:

                    return failure("Entity name not recognized");
            }

            // Parse data
            this.parseUnit();

            return success(this);

        });
    }

    /**
     *
     * @param value
     */
    getName (value: string): string {

        let returnName : string = "";

        switch (value.toLowerCase()) {
            case "m/s2":
            case "km/s2":
            case "km/h2": returnName = "aceleracion"; break;

            case "m/s":
            case "km/s":
            case "km/h": returnName = "velocidad"; break;
        }

        return returnName;
    }

    /**
     *
     * @param value
     */
    getUnit (value: string): string {
        return value.replace(/\d+/g, '').replace(' ', '').toLowerCase();
    }

    /**
     *
     * @param unit
     */
    unitTranslate (unit: string): string {

        let returnUnit : string = "";

        switch(unit) {
            case "kilometre": returnUnit = "km"; break;
            case "minute": returnUnit = "min"; break;
            case "metre": returnUnit = "m"; break;
            case "second": returnUnit = "s"; break;
        }

        return returnUnit;
    }

    /**
     *
     * @param value
     */
    getValue (value: string): string {

        let regexMatch: any = [];

        regexMatch = value.replace(',', '.').match(/([0-9.]+(\.[0-9]+)*)/);

        return (regexMatch) ? regexMatch[0] : "";
    }

    /**
     *
     */
    parseUnit (): void {

        switch(this.name) {

            case 'distancia':
                if(this.unit == 'km') {
                    this.value = (parseFloat(this.value) * 1000).toString();
                }

                this.unit = 'm';
                break;

            case 'velocidad':
                if(this.unit == 'km/h') {
                    this.value = (parseFloat(this.value) * (5 / 18)).toString();

                } else if(this.unit == 'km/s') {
                    this.value = (parseFloat(this.value) * 1000).toString();
                }

                this.unit = 'm/s';
                break;

            case 'tiempo':
                if(this.unit == 'min') {
                    this.value = (parseFloat(this.value) * 60).toString();
                }

                this.unit = 's';
                break;

            case 'aceleracion':
                if(this.unit == 'km/h2') {
                    this.value = (parseFloat(this.value) * 1000 * ( (1 / 3600) * (1 / 3600) )).toString();
                }

                this.unit = 'm/s2';
                break;
        }

    }
}

export { Datum }
