/*
 * LightningChartJS example that showcases creation of a grouped bars chart.
 */

export function createBarChart() {
    // Import LightningChartJS
    const lcjs = require('@arction/lcjs')

    // Extract required parts from LightningChartJS.
    const {
        lightningChart,
        LinearGradientFill,
        ColorHSV,
        AutoCursorModes,
        UIOrigins,
        LegendBoxBuilders,
        AxisTickStrategies,
        emptyLine,
        emptyFill,
        UIElementBuilders,
        Themes
    } = lcjs

    // Example test data.
    const groupedBarsValues = {
        groupNames: ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'],
        productNames: ['Product 1', 'Product 2', 'Product 3'],
        values: [
            // Quarter 1: product sales.
            [152000, 28300, 120000],
            // Quarter 2: product sales.
            [218000, 32600, 105600],
            // Quarter 3: product sales.
            [526900, 18000, 98500],
            // Quarter 4: product sales.
            [726500, 54600, 13400],
        ]
    }
    const quartersCount = groupedBarsValues.groupNames.length
    const productsCount = groupedBarsValues.productNames.length

    // : Plot a Bar Chart using Rectangle Series :

    const chart = lightningChart().ChartXY({
        container: 'bar-chart-element',
        // theme: Themes.dark
        // Configure Y Axis as logarithmic.
        defaultAxisY: {
            type: 'logarithmic',
            // Use 10 as log base.
            base: '10',
        },
    })
        .setTitle('Grouped Bars Chart with Logarithmic Y Axis')
        .setAutoCursorMode(AutoCursorModes.onHover)
        .setAutoCursor((cursor) => cursor
            .disposeTickMarkerX()
            .setGridStrokeXStyle(emptyLine)
            .disposeTickMarkerY()
            .setGridStrokeYStyle(emptyLine)
            .disposePointMarker()
            .setResultTable((resultTable) => resultTable
                .setOrigin(UIOrigins.Center)
            )
        )
        .setMouseInteractions(false)

    const xAxis = chart.getDefaultAxisX()
        .setTickStrategy(AxisTickStrategies.Empty)
        .setMouseInteractions(false)

    const yAxis = chart.getDefaultAxisY()
        .setTitle('Product sales (€)')

   

    // Create one Rectangle Series for each PRODUCT.
    const allProductsSeries = groupedBarsValues.productNames.map((productName, iProduct) => {
        const color = ColorHSV(iProduct * 120)
        const series = chart.addRectangleSeries()
            .setDefaultStyle((figure) => figure
                .setFillStyle(new LinearGradientFill({
                    angle: 0,
                    stops: [
                        { offset: 0, color: color.setA(50) },
                        { offset: 1, color: color },
                    ]
                }))
            )
            .setName(productName)
            .setCursorResultTableFormatter((builder, _, figure) => builder
                .addRow(`${productName} sales`)
                .addRow(`${figure.getDimensionsTwoPoints().y2} €`)
            )
        return series
    })

    const barWidthX = 1.0
    const groupsGapX = 1.0
    const edgesMarginX = 1.0

    // Add Rectangle figures for each Quarter and for each product.
    groupedBarsValues.values.forEach((quarterValues, iQuarter) => {
        quarterValues.forEach((quarterValue, iProduct) => {
            const productSeries = allProductsSeries[iProduct]
            const x1 = iQuarter * (productsCount * barWidthX + groupsGapX) + iProduct * barWidthX
            const x2 = x1 + barWidthX
            // NOTE: Logarithmic data range is not defined at 0.
            const y1 = 1
            const y2 = quarterValue
            productSeries.add({
                x1,
                x2,
                y1,
                y2
            })
        })
    })

    // Add X CustomTicks for each Quarter.
    groupedBarsValues.groupNames.forEach((quarterName, iQuarter) => {
        const x1 = iQuarter * (productsCount * barWidthX + groupsGapX)
        const x2 = x1 + productsCount * barWidthX
        xAxis.addCustomTick(UIElementBuilders.AxisTick)
            .setValue((x1 + x2) / 2)
            .setTextFormatter(() => quarterName)
            .setGridStrokeStyle(emptyLine)
    })

    // Set X view.
    xAxis.setInterval(-edgesMarginX, quartersCount * productsCount * barWidthX + (quartersCount - 1) * groupsGapX + edgesMarginX, false, true)

    // Add LegendBox.
    const legend = chart.addLegendBox(LegendBoxBuilders.VerticalLegendBox)
    legend.add(chart)
    }