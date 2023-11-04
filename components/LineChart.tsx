import React from 'react'
import { Grid, LineChart, XAxis, YAxis } from 'react-native-svg-charts'
import { View } from 'react-native'

import tw from 'twrnc'

interface AxesExampleProps {
    date: any[];
    volume: string[];
}

class AxesExample extends React.PureComponent<AxesExampleProps> {


    render() {

        const axesSvg = { fontSize: 10, fill: '#000' };
        const verticalContentInset = { top: 10, bottom: 10 }
        const xAxisHeight = 10

        // Layout of an x-axis together with a y-axis is a problem that stems from flexbox.
        // All react-native-svg-charts components support full flexbox and therefore all
        // layout problems should be approached with the mindset "how would I layout regular Views with flex in this way".
        // In order for us to align the axes correctly we must know the height of the x-axis or the width of the x-axis
        // and then displace the other axis with just as many pixels. Simple but manual.

        return (
            <View style={[tw`px-6 py-6`, { height: 300, flexDirection: 'row' }]}>
                <YAxis
                    data={this.props.volume}
                    style={{ marginBottom: xAxisHeight }}
                    contentInset={verticalContentInset}
                    svg={axesSvg}
                />
                <View style={{ flex: 1 }}>
                    <LineChart
                        style={{ flex: 1 }}
                        data={this.props.volume}
                        contentInset={verticalContentInset}
                        svg={{ stroke: 'rgb(34, 197, 94)', strokeWidth: 4 }}
                    >
                        <Grid/>
                    </LineChart>
                    <XAxis
                        style={{ marginHorizontal: -10, height: xAxisHeight }}
                        data={this.props.volume}
                        formatLabel={(value, index) => this.props.date[index]}
                        contentInset={{ left: 30, right: 30 }}
                        svg={axesSvg}
                    />
                </View>
            </View>
        )
    }

}

export default AxesExample