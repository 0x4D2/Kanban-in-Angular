import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Board } from '../models/board.model';
import { Column } from '../models/column.model';
import { TicketService } from '../services/ticket.service';
import { Ticket } from '../models/ticket.model';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})

export class MainViewComponent {
  board: Board;

  constructor(private ticketService: TicketService) {

    this.board = new Board('Chemical Check', [
      new Column('BACKLOG', []),
      new Column('TODO', []),
      new Column('IN PROGRESS', []),
      new Column('DONE', [])
    ].map((column, index) => ({ ...column, id: `column-${index}` }))); //Dirty später komme diese Daten ebenfalls von der DB
  }

  tickets: Ticket[] = [];
  backlogTickets: Ticket[] = [];
  todoTickets: Ticket[] = [];
  inProgressTickets: Ticket[] = [];
  doneTickets: Ticket[] = [];


  async ngOnInit(): Promise<void> {
    await this.getTickets();
  }

  async getTickets(): Promise<void> {
    this.ticketService.getTickets().subscribe(tickets => {
      const activeTickets = tickets.filter(t => !t.isArchived);
      this.tickets = activeTickets.sort((a, b) => a.priority - b.priority);
      this.sortTicketsIntoColumns();
    });
  }

  sortTicketsIntoColumns(): void {
    this.backlogTickets = this.tickets.filter(t => t.status === 'backlog');
    this.todoTickets = this.tickets.filter(t => t.status === 'todo');
    this.inProgressTickets = this.tickets.filter(t => t.status === 'inProgress');
    this.doneTickets = this.tickets.filter(t => t.status === 'done');
    this.updateColumns();
  }

  updateColumns(): void {
    this.board.columns[0].tasks = this.backlogTickets;
    this.board.columns[1].tasks = this.todoTickets;
    this.board.columns[2].tasks = this.inProgressTickets;
    this.board.columns[3].tasks = this.doneTickets;
  }

  async archiveTicket(ticket: Ticket): Promise<void> {
    ticket.isArchived = true;
    await this.ticketService.createEditeTicket(ticket).toPromise();
    await this.getTickets();
  }

  createTicket(ticketTitle: string, ticketDescription: string, ticketAssignee: string, ticketStatus: string) {
    const ticket: Ticket = {
      id: 0, 
      title: ticketTitle,
      description: ticketDescription,
      modifier: ticketAssignee,
      createdDate: new Date(),
      updatedDate: new Date(),
      isArchived: false,
      statusID: 0, //Für späteren prozess 
      priority: this.tickets.length + 1, //default piroty nach den erstellen
      status: ticketStatus
    };

    this.ticketService.createEditeTicket(ticket).subscribe(createdTicket => {
      this.tickets.push(createdTicket);
      this.sortTicketsIntoColumns();
    });
  }

  drop(event: CdkDragDrop<Ticket[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.updateTicketPriorities(event.container.data);
    } else {
      const movedTicket = event.previousContainer.data[event.previousIndex];
      movedTicket.status = this.getColumnStatus(event.container.id);
      movedTicket.priority = event.currentIndex;
      this.ticketService.createEditeTicket(movedTicket).subscribe(() => {
        this.getTickets();
      });
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      //this.updateTicketPriorities(event.previousContainer.data);
      this.updateTicketPriorities(event.container.data);
    }
  }
  //Dirty hier soll der Columname der List extrahiert werden, da diese schon vorhanden ist
  private getColumnStatus(id: string): string {
    switch (id) {
      case 'cdk-drop-list-0': return 'backlog';
      case 'cdk-drop-list-1': return 'todo';
      case 'cdk-drop-list-2': return 'inProgress';
      default: return 'done';
    }
  }

  private updateTicketPriorities(tickets: Ticket[]): void {
    for (let i = 0; i < tickets.length; i++) {
      tickets[i].priority = i;
      this.ticketService.createEditeTicket(tickets[i]).subscribe(() => {
        this.getTickets();
      });
    }
  }


}
