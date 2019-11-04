import React, { Fragment, useEffect } from 'react';
import axios from 'axios';
import {
  useParams
} from "react-router-dom";
import { ListGroup } from 'react-bootstrap';
import MapTrip from './MapTrip';
import TripCityList from './TripCityList';
import './TripPage.scss';


export default function TripPage(props) {
  const { trip_id } = useParams();
  const { tripInfo, citiesInfo, allCities, dispatch, SET_TRIP_DATA } = props;

  useEffect(() => {
    axios.get(`/trips/${trip_id}`)
      .then(all => {
        dispatch({ type: SET_TRIP_DATA, tripInfo: all.data[0], citiesInfo: all.data[1], allCities: [all.data[2]] })
      })
      .catch(err => console.log(err))
  }, []);

  if (tripInfo && citiesInfo) {
    const totalCost = citiesInfo.reduce(((total, city) => 
      total + city.accommodation_cost * city.days + city.transport_cost + city.avg_daily_expense * city.days
    ),0);
    const startDate = new Date(tripInfo[0].start_date);
    const endDate = new Date(tripInfo[0].start_date);
    endDate.setDate(endDate.getDate() + +tripInfo[0].total_days); 

    return (
      <Fragment>
        <header className="map">
          <MapTrip allCities={allCities} latitude={tripInfo[0].coordinate_latitude} longitude={tripInfo[0].coordinate_longitude} zoom={tripInfo[0].zoom}/>
        </header>
        <h1 className="trip-title">{tripInfo[0].name}</h1>
        <TripCityList citiesInfo={citiesInfo}/>
        <section className="block">
          <h3 className="summary-title">Summary</h3>
          <ListGroup variant="flush">
            <ListGroup.Item className="content">Cities explored: {tripInfo[0].cities_count}</ListGroup.Item>
            <ListGroup.Item className="content">Duration: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}, {tripInfo[0].total_days} days</ListGroup.Item>
            <ListGroup.Item className="content">Cost: ${totalCost}</ListGroup.Item>
          </ListGroup>
        </section>
      </Fragment>
    );
  } else {
    return null
  }
};