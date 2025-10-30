using System.Collections.Concurrent;
using TaskManager.Api.Models;

namespace TaskManager.Api.Services
{
    public class TaskService
    {
        private readonly ConcurrentDictionary<Guid, TaskItem> _tasks = new();

        public IEnumerable<TaskItem> GetAllTasks()
        {
            return _tasks.Values.OrderBy(t => t.Description);
        }

        public TaskItem? GetTaskById(Guid id)
        {
            _tasks.TryGetValue(id, out var task);
            return task;
        }

        public TaskItem AddTask(string description)
        {
            var task = new TaskItem
            {
                Id = Guid.NewGuid(),
                Description = description,
                IsCompleted = false
            };
            _tasks[task.Id] = task;
            return task;
        }

        public TaskItem? UpdateTask(Guid id, TaskItem taskUpdate)
        {
            if (_tasks.TryGetValue(id, out var existingTask))
            {
                
                existingTask.Description = taskUpdate.Description;
                existingTask.IsCompleted = taskUpdate.IsCompleted;
                return existingTask;
            }
            return null; 
        }
        public bool DeleteTask(Guid id)
        {
           
            return _tasks.TryRemove(id, out _);
        }
    }
}