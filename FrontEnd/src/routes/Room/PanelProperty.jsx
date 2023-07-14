import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import WrapperList from '../../components/WrapperList'
import { CardMini } from '../../items/Card'

/** @param {{ data: number[], type: number, onSelect: (id: number) => void }} props */
function SectionList({ data, type, onSelect }){
    return (
        <WrapperList
            data={data}
            item={(item, index) => (
                <CardMini
                    key={index}
                    id={item}
                    type={type}
                    onClick={onSelect}
                />
            )}
        />
    )
}

/** Panel for the properties, utilities and railroads 
 * @type {React.FC<{
 * asABank: boolean,
 * properties: number[],
 * utilities: number[],
 * railRoads: number[],
 * onSelect: (id: number) => void,
 * selTabProperties: number,
 * setSelTabProperties: (index: number) => void
 * }>}
 **/
const PanelProperty = React.memo(({
    asABank,
    properties,
    utilities,
    railRoads,
    onSelect,
    selTabProperties,
    setSelTabProperties
}) => {
    return (
        <Tabs
            selectedIndex={selTabProperties}
            onSelect={(index) => setSelTabProperties(index)}
            focusTabOnClick={false}
            disableLeftRightKeys={true}
            disableUpDownKeys={true}
            style={{ width: "100%", marginTop: "20px" }}
            selectedTabClassName='selectedTab'
        >
            <TabList className="react-tabs__tab-list second">
                <Tab> Propiedades </Tab>
                <Tab> Servicios </Tab>
                <Tab> Ferrocarriles </Tab>
            </TabList>

            <TabPanel>
                <SectionList 
                    data={asABank ? Array.from({ length: 22 }, (_, i) => i) : properties.sort((a, b) => a - b)}
                    type={0} 
                    onSelect={onSelect} 
                />
            </TabPanel>
            <TabPanel>
                <SectionList 
                    data={asABank ?  [0, 1] : utilities.sort((a, b) => a - b)}
                    type={1} 
                    onSelect={onSelect} 
                />
            </TabPanel>
            <TabPanel>
                <SectionList 
                    data={asABank ? [0, 1, 2, 3] : railRoads.sort((a, b) => a - b)}
                    type={2} 
                    onSelect={onSelect} 
                />
            </TabPanel>
        </Tabs>
    )
})

export default PanelProperty