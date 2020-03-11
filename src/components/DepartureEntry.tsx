import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiKey from '../apikey';
import BorderedSpan from './styles/BorderedSpan';
import TableRow from './styles/TableRow';
import './DepartureEntry.css';

function displayTime(time : Date) {
    const realHour : number = new Date(time).getHours();
    const realMinutes : number = new Date(time).getMinutes();
    let suffix = "AM";

    let displayHour : string = `${realHour}`;
    let displayMinutes : string = `${realMinutes}`;

    if(realHour > 11) {
        displayHour = `${realHour - 12}`;
        suffix = "PM";
    }
    if(realHour === 0) {
        displayHour = "12";
    }
    if(realMinutes < 10) {
        displayMinutes = `0${realMinutes}`;
    }
    return `${displayHour}:${displayMinutes} ${suffix}`
}

function parseTrainNumber(vehicleData : any) {
    if(vehicleData) {
        const vehicleID = parseFloat(vehicleData.id);
        if(!isNaN(vehicleID)) {
            return vehicleID;
        }
    }
    return "TBD";
}

function DepartureEntry(props : any) {

    const [ destination, setDestination ] = useState("");

    useEffect(() => {

        async function determineDestination(departureData : any) {
            let finalDestination = "";
        
            const tripData = departureData.relationships.trip.data.id;
        
            const destinationData = await axios.get(`https://api-v3.mbta.com/trips/${tripData}?api_key=${apiKey}`)
        
            finalDestination = destinationData.data.data.attributes.headsign;
        
            if(finalDestination === "Forge Park/495" || finalDestination === "Foxboro") {
                if(departureData.relationships.route.data.id === "CR-Fairmount") {
                    finalDestination = `${finalDestination} via Fairmount`;
                }
            } else if (finalDestination === "Haverhill") {
                if(departureData.relationships.route.data.id === "CR-Lowell") {
                    finalDestination = `${finalDestination} via Wildcat`;
                }
            }

            finalDestination = finalDestination.replace(/\//g," / ");
        
            setDestination(finalDestination);
        }
        determineDestination(props.destinationData);

    }, [props.destinationData, destination]);

    

    return (
        <TableRow>
            <BorderedSpan className="yellow">MBTA</BorderedSpan>
            <BorderedSpan className="yellow">{displayTime(props.trainTime)}</BorderedSpan>
            <BorderedSpan className="yellow">{destination}</BorderedSpan>
            <BorderedSpan className="yellow">{parseTrainNumber(props.trainNumber)}</BorderedSpan>
            <BorderedSpan className="yellow">{props.trackNumber}</BorderedSpan>
            <BorderedSpan className="green">{props.status}</BorderedSpan>
        </TableRow>
    );
}

export default DepartureEntry;
