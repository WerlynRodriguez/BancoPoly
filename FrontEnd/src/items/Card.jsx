import "./Card.css"

const allColors = ["#8B4513", "#ADD8E6", "#800080", "#FFA500", "#FF0000", "#FFFF00", "#008000", "#0000FF"];

const allProperties = [
    ["Ave. Mediterranea",       60, 2, 10, 30, 90, 160, 250, 30, 50, 0],
    ["Ave. Baltica",            60, 4, 20, 60, 180, 320, 450, 30, 50, 0],

    ["Ave. Oriental",           100, 6, 30, 90, 270, 400, 550, 50, 50, 1],
    ["Ave. Vermont",            100, 6, 30, 90, 270, 400, 550, 50, 50, 1],
    ["Ave. Connecticut",        120, 8, 40, 100, 300, 450, 600, 60, 50, 1],

    ["Plaza San Carlos",        140, 10, 50, 150, 450, 625, 750, 70, 100, 2],
    ["Ave. de los Estados",     140, 10, 50, 150, 450, 625, 750, 70, 100, 2],
    ["Ave. Virginia",           160, 12, 60, 180, 500, 700, 900, 80, 100, 2],

    ["Plaza Santiago",          180, 14, 70, 200, 550, 750, 950, 90, 100, 3],
    ["Ave. Tennessee",          180, 14, 70, 200, 550, 750, 950, 90, 100, 3],
    ["Ave. Nueva York",         200, 16, 80, 220, 600, 800, 1000, 100, 100, 3],

    ["Ave. Kentucky",           220, 18, 90, 250, 700, 875, 1050, 110, 150, 4],
    ["Ave. Indiana",            220, 18, 90, 250, 700, 875, 1050, 110, 150, 4],
    ["Ave. Illinois",           240, 20, 100, 300, 750, 925, 1100, 120, 150, 4],

    ["Ave. Atlantico",          260, 22, 110, 330, 800, 975, 1150, 130, 150, 5],
    ["Ave. Ventnor",            260, 22, 110, 330, 800, 975, 1150, 130, 150, 5],
    ["Jardines Marvin",         280, 24, 120, 360, 850, 1025, 1200, 140, 150, 5],

    ["Ave. Pacifico",           300, 26, 130, 390, 900, 1100, 1275, 150, 200, 6],
    ["Ave. Carolina del Norte", 300, 26, 130, 390, 900, 1100, 1275, 150, 200, 6],
    ["Ave. Pennsylvania",       320, 28, 150, 450, 1000, 1200, 1400, 160, 200, 6],

    ["Plaza del Parque",        350, 35, 175, 500, 1100, 1300, 1500, 175, 200, 7],
    ["Paseo Tablado",           400, 50, 200, 600, 1400, 1700, 2000, 200, 200, 7]
]

const allRailroads = [
    "READING",
    "PENSILVANIA",
    "B.&O",
    "SHORT LINE"
]

const allUtilities = [
    "COMPAÑIA DE ELECTRICIDAD",
    "OBRAS DE AGUA POTABLE"
]

export const getNameFromData = [
    (id) => allProperties[id][0],
    (id) => allUtilities[id],
    (id) => allRailroads[id]
]

/** @param {{id: number}} props */
export function CardProperty ({ id = 0 }) {
    const property = allProperties[id]
    return (
        <div className="cardGame cardProperty">
            <p className="header title"
            style={{ backgroundColor: allColors[property[10]] }}>
                TITULO DE PROPIEDAD <br/> 
                {property[0]} <br/>
            </p>
            <br/>
            <table>
                <tbody>
                    <tr>
                        <td>Alquiler</td>
                        <td>${property[2]}</td>
                    </tr>
                    <tr>
                        <td>Con 1 casa</td>
                        <td>${property[3]}</td>
                    </tr>
                    <tr>
                        <td>Con 2 casas</td>
                        <td>${property[4]}</td>
                    </tr>
                    <tr>
                        <td>Con 3 casas</td>
                        <td>${property[5]}</td>
                    </tr>
                    <tr>
                        <td>Con 4 casas</td>
                        <td>${property[6]}</td>
                    </tr>
                    <tr>
                        <td>Con hotel</td>
                        <td>${property[7]}</td>
                    </tr>
                </tbody>
            </table>
            <p className="block" style={{ fontSize: "11px" }}>
                Valor hipotecable ${property[8]} <br/>
                Las casas cuestan ${property[9]}. Cada una <br/>
                Los hoteles, ${property[9]}. Mas 4 casas 
            </p>
            <p className="block" style={{ fontSize: "9px" }}>
                Cuando un jugador posee todas las propiedades de un grupo, 
                el alquiler es el doble.
            </p>
        </div>
    )
}

/** @param {{id: number}} props */
export function CardRailRoad ({ id = 0}) {
    return (
        <div className="cardGame cardRailRoad">
            <div className="header"></div>
            <p className="title">
                FERROCARRIL <br/>
                {allRailroads[id]}
            </p>
            <br/>
            <table>
                <tbody>
                    <tr>
                        <td>Alquiler</td>
                        <td>$25</td>
                    </tr>
                    <tr>
                        <td>Con 2 ferrocarriles</td>
                        <td>$50</td>
                    </tr>
                    <tr>
                        <td>Con 3 ferrocarriles</td>
                        <td>$100</td>
                    </tr>
                    <tr>
                        <td>Con 4 ferrocarriles</td>
                        <td>$200</td>
                    </tr>
                </tbody>
            </table>
            <p className="block" style={{ fontSize: "11px" }}>
                Valor hipotecable $100
            </p>
        </div>
    )
}

export function CardUtility ({ id = 0 }) {
    return (
        <div className="cardGame cardUtility">
            <div className={`header ${id === 0 ? "electric" : "water"}`}></div>
            <p className="title">
                {allUtilities[id]}
            </p>

            <p className="block">
                Si uno de los servicios es propiedad de un jugador, 
                el alquiler es 4 veces la cantidad que marque el dado 
                si el jugador tiene uno de los servicios, y 10 veces 
                la cantidad que marque el dado si tiene ambos servicios.
            </p>

            <p className="block" style={{ fontSize: "9px" }}>
                Valor hipotecable $75
            </p>
        </div>
    )
}

/** @param {{id: number, type: number, onClick: (id: number) => void}} props */
export function CardMini ({ id = 0, type = 0, onClick = () => {} }) {
    return (
        <div 
            className="btn"
            onClick={() => onClick(id)}
            style={{
                width: '40%',
                height: '80px',
                display: 'grid',
                placeItems: 'center',
                fontSize: '12px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                border: `4px solid ${type === 0 ? allColors[allProperties[id][10]] : "#000"}`,
            }}
        >
            { getNameFromData[type](id) }
        </div>
    )
}

const notifTypes = ["income","pay"]

/** @param {{type: number}} props */
export function CardNotif ({ type = 0, amount = 0, entity = "", time = "" }) {
    return (
        <div className={"btn cardNotif " + notifTypes[type]}>
            <h3>{amount}$</h3>
            <p>{entity}</p>
            <p>{time}</p>
        </div>
    )
}