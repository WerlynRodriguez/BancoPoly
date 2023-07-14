
/** Create a list of items from given data
 * @param {{ data: number[], item: (item: any, index: number) => React.ReactNode }} props
 * @returns {React.Component}
 * @example
 * <WrapperList data={[1,2,3]} item={(item, index) => <div key={index}>{item}</div>} />
 **/
export default function WrapperList({ data, item })  {
    return (
        <div style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "8px",
            overflow: "auto",
        }}>
        {
            data && data?.length  === 0 ?
                <div style={{ width: "100%", textAlign: "center" }}> No hay elementos </div>
            :
                data.map(item)
        }
        </div>
    )
}