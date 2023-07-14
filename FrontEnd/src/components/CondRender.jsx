/** Conditionally renders children based on a condition prop
 * @param {Object} props
 * @param {Boolean} props.condition
 * @param {JSX.Element} props.children
 * @returns {JSX.Element}
 * @example
 * <CondRender condition={true}>
 *  <h1>Rendered</h1>
 * </CondRender>
 * // returns <h1>Rendered</h1>
 **/
export default function CondRender(props) {
    if (props.condition) return props.children
    else return null
}