import React, { Component } from "react"
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps"

const wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto",
}

export default class CountryMap extends Component {


  getCountryMapJson = () => {
    let countryCode = this.props.location.state.link.id
    let path = `/simpleMaps/${countryCode}.json`
    console.log(path)
    return path
  }

  render() {
    return (
      <div style={wrapperStyles}>
        <ComposableMap
          projection="mercator"
          projectionConfig={{ scale: 10000 }}
          width={980}
          height={551}
          style={{
            width: "100%",
            height: "auto",
          }}
          >
          <ZoomableGroup center={[ 8.2, 46.8 ]} disablePanning>
            <Geographies geography={this.getCountryMapJson()}>
              {(geographies, projection) =>
                geographies.map((geography, i) =>
                  geography.id !== "ATA" && (
                    <Geography
                      key={i}
                      geography={geography}
                      projection={projection}
                      style={{
                        default: {
                          fill: "#ECEFF1",
                          stroke: "#607D8B",
                          strokeWidth: 0.75,
                          outline: "none",
                        },
                        hover: {
                          fill: "#607D8B",
                          stroke: "#607D8B",
                          strokeWidth: 0.75,
                          outline: "none",
                        },
                        pressed: {
                          fill: "#FF5722",
                          stroke: "#607D8B",
                          strokeWidth: 0.75,
                          outline: "none",
                        }
                      }}
                    />
                  ))}
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>
        )
      }
    }