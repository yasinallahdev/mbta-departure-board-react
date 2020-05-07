import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CenteredHeading from './styles/CenteredHeading';
import apiKey from '../apikey';
import DepartureEntry from './DepartureEntry';
import axios from 'axios';
import BorderedSpan from './styles/BorderedSpan';
import TableRow from './styles/TableRow';

const NStationQuery = "stop=place-north&route=CR-Fitchburg,CR-Haverhill,CR-Lowell,CR-Newburyport"
const SStationQuery = "stop=place-sstat&route=CR-Greenbush,CR-Middleborough,CR-Kingston,CR-Fairmount,CR-Franklin,CR-Worcester,CR-Providence,CR-Needham";

const StationBoard = styled.section`
    border: 2px solid white;
`;

function Board(props) {

    const [data, setData] = useState({ data: []});

    useEffect(() => {
        async function fetchData() {

            const result = await axios.get(`https://api-v3.mbta.com/predictions/?api_key=${apiKey}&${(props.station === "North Station")?(NStationQuery):(SStationQuery)}`);

            if(result) {
                const filteredResult = result.data.data.filter((elem) => {
                    return (elem.relationships.stop.data.id.includes(props.station)) && (elem.attributes.departure_time !== null ? true : false);
                })

                const sortedResult = filteredResult.sort((a, b) => {
                    return new Date(a.attributes.departure_time).getTime() - new Date(b.attributes.departure_time).getTime();
                });
                //console.log(sortedResult);
                setData(sortedResult);
                
            }
        }

        fetchData();
        
        const interval = setInterval(() => {
            fetchData();
          }, 60000);
          return () => clearInterval(interval);

    }, [props.station]);

    if(data && data.length) {
        console.log(data);
        return (
            <StationBoard>
                <CenteredHeading>
                    <h2>{props.station} Departure Board</h2>
                </CenteredHeading>
                <TableRow>
                    <BorderedSpan>Carrier</BorderedSpan>
                    <BorderedSpan>Time</BorderedSpan>
                    <BorderedSpan>Destination</BorderedSpan>
                    <BorderedSpan>Train #</BorderedSpan>
                    <BorderedSpan>Track #</BorderedSpan>
                    <BorderedSpan>Status</BorderedSpan>
                </TableRow>
                    {
                        data.map((elem) => {
                            const stationData = elem.relationships.stop.data.id.split('-');
                            const trainDepartTime = elem.attributes.departure_time;
                            const trainVehicleNumber = elem.relationships.vehicle.data;
                            const trackDepartureNumber = (stationData.length > 1)?(parseFloat(stationData[1])):("TBD");
                            const trainStatus = elem.attributes.status;
                            return (
                                <DepartureEntry key={elem.id} trainTime={trainDepartTime} destinationData={elem} trainNumber={trainVehicleNumber} trackNumber={trackDepartureNumber} status={trainStatus} />
                            );
                        })
                    }
            </StationBoard>
        );
    } else {
        return (
            <StationBoard>
                <CenteredHeading>
                    <h2>{props.station} Departure Board</h2>
                </CenteredHeading>
            </StationBoard>
        );
    }
}

export default Board;
