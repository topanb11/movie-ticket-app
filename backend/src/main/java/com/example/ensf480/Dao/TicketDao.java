package com.example.ensf480.Dao;

import java.util.UUID;

import com.example.ensf480.Model.Ticket;

public interface TicketDao {
    Ticket createTicket(Ticket ticket);

    String deleteTicket(String id, Boolean isRu);

}