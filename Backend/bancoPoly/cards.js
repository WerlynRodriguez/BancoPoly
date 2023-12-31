const allColors = ["brown", "lightblue", "purple", "orange", "red", "yellow", "green", "blue"]

const allProperties = [
    [
        ["Ave. Mediterranea",   60, 2, 10, 30, 90, 160, 250, 30, 50],
        ["Ave. Baltica",        60, 4, 20, 60, 180, 320, 450, 30, 50],
    ],
    [
        ["Ave. Oriental",       100, 6, 30, 90, 270, 400, 550, 50, 50], 
        ["Ave. Vermont",        100, 6, 30, 90, 270, 400, 550, 50, 50],
        ["Ave. Connecticut",    120, 8, 40, 100, 300, 450, 600, 60, 50],
    ],
    [
        ["Plaza San Carlos",    140, 10, 50, 150, 450, 625, 750, 70, 100],
        ["Ave. de los Estados", 140, 10, 50, 150, 450, 625, 750, 70, 100],
        ["Ave. Virginia",       160, 12, 60, 180, 500, 700, 900, 80, 100],
    ],
    [
        ["Plaza Santiago",      180, 14, 70, 200, 550, 750, 950, 90, 100],
        ["Ave. Tennessee",      180, 14, 70, 200, 550, 750, 950, 90, 100],
        ["Ave. Nueva York",     200, 16, 80, 220, 600, 800, 1000, 100, 100],
    ],
    [
        ["Ave. Kentucky",       220, 18, 90, 250, 700, 875, 1050, 110, 150],
        ["Ave. Indiana",        220, 18, 90, 250, 700, 875, 1050, 110, 150],
        ["Ave. Illinois",       240, 20, 100, 300, 750, 925, 1100, 120, 150],
    ],
    [
        ["Ave. Atlantico",      260, 22, 110, 330, 800, 975, 1150, 130, 150],
        ["Ave. Ventnor",        260, 22, 110, 330, 800, 975, 1150, 130, 150],
        ["Jardines Marvin",     280, 24, 120, 360, 850, 1025, 1200, 140, 150],
    ],
    [
        ["Ave. Pacifico",       300, 26, 130, 390, 900, 1100, 1275, 150, 200],
        ["Ave. Carolina del Norte", 300, 26, 130, 390, 900, 1100, 1275, 150, 200],
        ["Ave. Pennsylvania",   320, 28, 150, 450, 1000, 1200, 1400, 160, 200],
    ],
    [
        ["Plaza del Parque",    350, 35, 175, 500, 1100, 1300, 1500, 175, 200],
        ["Paseo Tablado",       400, 50, 200, 600, 1400, 1700, 2000, 200, 200]
    ]
]

const allUtilities = [
    ["Compañia Electrica", 150, 75],
    ["Compañia de Agua", 150, 75]
]

const allRailroads = [
    ["Ferrocarril Reading", 200, 100],
    ["Ferrocarril Pensilvania", 200, 100],
    ["Ferrocarril B&O", 200, 100],
    ["Ferrocarril Short Line", 200, 100]
]
    

export class Property {
    constructor( id, houses ) {
        /** @type {number} */
        this.id = id;

        /** 0 to 4 if is -5 is a hotel
         * @type {number} */
        this.houses = houses;
    }
}