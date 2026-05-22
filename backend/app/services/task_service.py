from sqlalchemy.orm import Session
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate


def get_tasks(
    db: Session,
    owner_id: int,
    completed: bool | None,
    skip: int,
    limit: int,
) -> tuple[list[Task], int]:
    query = db.query(Task).filter(Task.owner_id == owner_id)

    if completed is not None:
        query = query.filter(Task.completed == completed)

    total = query.count()
    tasks = query.order_by(Task.created_at.desc()).offset(skip).limit(limit).all()
    return tasks, total


def get_task_by_id(db: Session, task_id: int, owner_id: int) -> Task | None:
    return (
        db.query(Task)
        .filter(Task.id == task_id, Task.owner_id == owner_id)
        .first()
    )


def create_task(db: Session, task_data: TaskCreate, owner_id: int) -> Task:
    task = Task(
        title=task_data.title,
        description=task_data.description,
        owner_id=owner_id,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def update_task(db: Session, task: Task, updates: TaskUpdate) -> Task:
    update_data = updates.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()