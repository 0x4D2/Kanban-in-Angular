export class Ticket {
  id: number;
  title?: string;
  description?: string;
  modifier: string;
  createdDate: Date;
  updatedDate: Date;
  isArchived: boolean;
  statusID: number;
  priority: number;
  status: string;

  constructor(
    id: number,
    title: string,
    description: string,
    modifier: string,
    createdDate: Date,
    updatedDate: Date,
    isArchived: boolean,
    statusID: number,
    priority: number,
    status: string
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.modifier = modifier;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
    this.isArchived = isArchived;
    this.statusID = statusID;
    this.priority = priority;
    this.status = status;
  }
}
