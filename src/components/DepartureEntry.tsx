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
    console.log(vehicleData);
    if(vehicleData) {
        const vehicleID = parseFloat(vehicleData);
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
        
            // If a Franklin or Foxboro Line train is routed over the Fairmount Line rather than the Northeast Corridor,
            // display 'via Fairmount' following the destination name. (Fairmount is the final stop on the line before
            // trains join the Franklin Line at Readville)
            if(finalDestination === "Forge Park/495" || finalDestination === "Foxboro") {
                if(departureData.relationships.route.data.id === "CR-Fairmount") {
                    finalDestination = `${finalDestination} via Fairmount`;
                }
            // If a Haverhill Line train is routed over the Wildcat Branch rather than the Reading routing, it will display
            // 'via Anderson RTC' or 'via North Wilmington' following the destination name. (Anderson RTC is a major stop on the
            // Lowell Line and the Amtrak Downeaster, while North Wilmington is the final stop Haverhill-line trains use before
            // entering the Wildcat Branch to reach the proper Haverhill Line at Ballardvale. Final text has not been decided
            // upon.)
            } else if (finalDestination === "Haverhill") {
                if(departureData.relationships.route.data.id === "CR-Lowell") {
                    finalDestination = `${finalDestination} via Anderson RTC`;
                }
            }

            // Insert a space surrounding any '/' characters (so that Middleborough/Lakeville displays as Middleborough / Lakeville, for example)
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
