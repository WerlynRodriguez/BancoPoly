import "./TextLoader.css"

/** @param {{text: string}} props */
export default function TextLoader({ text = "Loading" }) {
    return (
        <div className="text-loader" >
            <h3>{text}</h3>
        </div>
    )
}