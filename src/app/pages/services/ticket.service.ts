import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient) { }

  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>('https://localhost:7139/api/Card/GetAllCards');
  }

  createEditeTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>('https://localhost:7139/api/Card/CreateEditCard', ticket);
  }


  deleteTicket(id: number): Observable<void> {
    return this.http.delete<void>(`https://localhost:7139/api/Card/DeleteCard/${id}`);
  }
}
