// src/app/components/task-list/task-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Task List</h1>
        <button (click)="downloadDatabase()" class="download-button">
          Download Database
        </button>
      </div>
      
      <div class="add-task">
        <input 
          type="text" 
          [(ngModel)]="newTaskTitle" 
          (keyup.enter)="addTask()"
          placeholder="Add new task..."
          class="task-input"
        >
        <button (click)="addTask()" class="add-button">Add Task</button>
      </div>

      <div class="task-list">
        @for (task of tasks; track task.id) {
          <div class="task-item" [class.completed]="task.completed">
            <input 
              type="checkbox"
              [checked]="task.completed"
              (change)="toggleTask(task.id)"
            >
            <span class="task-title">{{ task.title }}</span>
            <button (click)="deleteTask(task.id)" class="delete-button">Delete</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .download-button {
      padding: 0.5rem 1rem;
      background-color: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      
      &:hover {
        background-color: #1976D2;
      }
    }

    .add-task {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .task-input {
      flex: 1;
      padding: 0.5rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .add-button {
      padding: 0.5rem 1rem;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      
      &:hover {
        background-color: #45a049;
      }
    }

    .task-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .task-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background-color: #f9f9f9;
      border-radius: 4px;
      
      &.completed .task-title {
        text-decoration: line-through;
        color: #666;
      }
    }

    .task-title {
      flex: 1;
    }

    .delete-button {
      padding: 0.25rem 0.5rem;
      background-color: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      
      &:hover {
        background-color: #da190b;
      }
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTaskTitle = '';

  constructor(private dbService: DatabaseService) {}

  async ngOnInit() {
    await this.loadTasks();
  }

  async loadTasks() {
    this.tasks = await this.dbService.getTasks();
  }

  async addTask() {
    if (!this.newTaskTitle.trim()) return;
    
    await this.dbService.addTask(this.newTaskTitle);
    this.newTaskTitle = '';
    await this.loadTasks();
  }

  async toggleTask(id: number) {
    await this.dbService.toggleTask(id);
    await this.loadTasks();
  }

  async deleteTask(id: number) {
    await this.dbService.deleteTask(id);
    await this.loadTasks();
  }

  downloadDatabase() {
    const dbExport = this.dbService.getDatabaseExport();
    if (!dbExport) {
      alert('Database not initialized');
      return;
    }

    // Create blob from the database export
    const blob = new Blob([dbExport], { type: 'application/x-sqlite3' });
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks-${new Date().toISOString().split('T')[0]}.db`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
