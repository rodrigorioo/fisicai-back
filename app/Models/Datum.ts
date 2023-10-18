

// TODO: Load entity return

class Datum {

    name : string = "";
    value : string = "";
    unit : string = "";

    constructor (name?: string, value?: string, unit?: string) {

        this.name = (name) ? name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "_") : "";
        this.value = (value) ? value : "";
        this.unit = (unit) ? unit : "";

        // TODO: Parse unit
    }
}

export { Datum }
