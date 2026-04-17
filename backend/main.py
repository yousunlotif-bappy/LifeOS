from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI(
    title="LifeOS API",
    description="A simple task management backend",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Task(BaseModel):
    title: str
    priority: str
    completed: bool = False

tasks: List[Task] = []

@app.get("/")
def read_home():
    return {"message": "LifeOS backend running 🚀"}

@app.get("/tasks")
def get_tasks():
    return {
        "count": len(tasks),
        "tasks": tasks
    }

@app.post("/tasks")
def create_task(task: Task):
    tasks.append(task)
    return {
        "status": "success",
        "message": "Task added successfully ✅",
        "task": task
    }

@app.post("/generate-plan")
def generate_plan():
    try:
        if not tasks:
            return {
                "status": "error",
                "message": "No tasks available"
            }

        pending_tasks = [task for task in tasks if not task.completed]

        if not pending_tasks:
            return {
                "status": "success",
                "message": "All tasks completed",
                "plan": []
            }

        priority_order = {
            "high": 1,
            "medium": 2,
            "low": 3
        }

        sorted_tasks = sorted(
            pending_tasks,
            key=lambda task: priority_order.get(task.priority.lower(), 4)
        )

        time_slots = [
            "9:00 AM",
            "11:00 AM",
            "1:00 PM",
            "3:00 PM",
            "5:00 PM",
            "7:00 PM"
        ]

        plan = []
        for i, task in enumerate(sorted_tasks):
            time = time_slots[i] if i < len(time_slots) else f"{7+i}:00 PM"
            plan.append(f"{time} - {task.title} ({task.priority})")

        return {
            "status": "success",
            "plan": plan
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
    

    tasks = []

@app.get("/tasks")
def get_tasks():
    return {"tasks": tasks}

@app.post("/tasks")
def add_task(task: dict):
    tasks.append(task)
    return {"message": "Task added"}