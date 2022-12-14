import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { styled } from "@mui/system";
import NavBar from "../components/NavBar.js";
import Grid from "@mui/material/Grid";
import Seat from "../components/Seat";
import Legend from "../components/Legend";
import Checkout from "../components/Checkout.js";
import { UserContext } from "../context/UserContext.js";
import axios from "axios";
import moment from "moment";

const Wrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  padding: "50px 10%",
});

const Title = styled("div")({
  fontFamily: "Bebas Neue, cursive",
  fontSize: "48px",
  marginBottom: "10px",
});

const Body = styled("div")({
  fontFamily: "Roboto, sans-serif",
  color: "#0F1020",
  fontWeight: "400",
  fontSize: "20px",
});

const TheatreContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  padding: "35px 15%",
  alignItems: "center",
});

const Screen = styled("div")({
  width: "100%",
  backgroundColor: "black",
  color: "white",
  height: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "5%",
});

const SeatContainer = styled(Grid)({
  padding: "0 10% 5% 10%",
});

const SeatSelection = () => {
  // Object that has movie attributes
  const location = useLocation();
  const [selectedSeats, setSelectedSeats] = useState([]); // keep track of which seats have been selected
  const [unavailableSeats, setUnavailableSeats] = useState([]); // seats already purchased/unavailable
  // 48 seats per theatre
  const seats = [];
  for (let i = 0; i < 48; i++) {
    seats.push(i + 1);
  }

  // on page load, get unavailable seats
  useEffect(() => {
    getUnavailableSeats();
  }, []);

  const getUnavailableSeats = () => {
    const showtime_id = location.state.movie["selectedShowtime"]["showtimeId"]; // get showtime
    // make api call to get seats already purchased/unavailable
    axios
      .get(`http://localhost:8080/api/v1/ticket/seats/by/${showtime_id}`, {})
      .then((response) => {
        setUnavailableSeats(response.data);
      })
      .catch((response) => {
        alert("Failed to get purchased seats", response.response.data.message);
      });
  };

  // handle selecting seats -> add/remove seat from selectedSeats
  const clickSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      // remove seat from selection
      const updatedSeats = selectedSeats.filter((s) => s !== seat);
      setSelectedSeats(updatedSeats);
    } else {
      // add seat to selection

      // if not presale -> select seat
      if (!location.state.movie.selectedShowtime.presale) {
        const updatedSeats = [...selectedSeats, seat];
        setSelectedSeats(updatedSeats);
      } else {
        // if presale, make sure only 10% seats are selected/purchased
        if (selectedSeats.length + unavailableSeats.length < 4) {
          const updatedSeats = [...selectedSeats, seat];
          setSelectedSeats(updatedSeats);
        }
      }
    }
  };

  // convert showtime to human readable form
  const convertTime = (time) => {
    let unixtime = Date.parse(time);
    unixtime /= 1000;
    return moment.unix(unixtime).format("MMM Do YYYY, h:mm A");
  };

  // check state of seat (available, unavailable, selected) and pass in correct value to Seat component
  const renderSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      return (
        <Grid item xs={2} key={seat}>
          <Seat state="selected" seatNo={seat} handleClick={clickSeat}></Seat>
        </Grid>
      );
    }
    if (unavailableSeats.includes(seat)) {
      return (
        <Grid item xs={2} key={seat}>
          <Seat state="unavailable" seatNo={seat}></Seat>
        </Grid>
      );
    }
    return (
      <Grid item xs={2} key={seat}>
        <Seat state="available" seatNo={seat} handleClick={clickSeat}></Seat>
      </Grid>
    );
  };

  return (
    <>
      <NavBar></NavBar>
      <Wrapper>
        <Title>{location.state.movie.name}</Title>
        <Body>
          {convertTime(location.state.movie.selectedShowtime.timestamp)}
        </Body>
        {location.state.movie.selectedShowtime.presale ? (
          <Body style={{ paddingTop: "1%", color: "#E16138" }}>Presale</Body>
        ) : null}
        <TheatreContainer>
          <Screen>SCREEN</Screen>
          <SeatContainer container spacing={2}>
            {seats.map((seat) => renderSeat(seat))}
          </SeatContainer>
          <Legend></Legend>
        </TheatreContainer>
        <Checkout
          seats={selectedSeats}
          showtimeId={location.state.movie["selectedShowtime"]["showtimeId"]}
        ></Checkout>
      </Wrapper>
    </>
  );
};

export default SeatSelection;
