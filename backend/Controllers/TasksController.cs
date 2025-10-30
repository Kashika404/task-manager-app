using Microsoft.AspNetCore.Mvc;
using TaskManager.Api.Models;
using TaskManager.Api.Services;

namespace TaskManager.Api.Controllers
{
    [ApiController] 
    [Route("api/tasks")] 
    public class TasksController : ControllerBase
    {
        private readonly TaskService _taskService;
        public TasksController(TaskService taskService)
        {
            _taskService = taskService;
        }

        
        [HttpGet]
        public IActionResult GetAllTasks()
        {
            var tasks = _taskService.GetAllTasks();
            return Ok(tasks); 
        }

        [HttpPost]
        public IActionResult AddTask([FromBody] TaskItem request)
        {
            
            if (string.IsNullOrWhiteSpace(request.Description))
            {
                return BadRequest("Description cannot be empty.");
            }

            var task = _taskService.AddTask(request.Description);
       
            return CreatedAtAction(nameof(GetTaskById), new { id = task.Id }, task);
        }

      
        [HttpGet("{id}")]
        public IActionResult GetTaskById(Guid id)
        {
            var task = _taskService.GetTaskById(id);
            return task == null ? NotFound() : Ok(task);
        }

     
        [HttpPut("{id}")]
        public IActionResult UpdateTask(Guid id, [FromBody] TaskItem taskUpdate)
        {
            var updatedTask = _taskService.UpdateTask(id, taskUpdate);

            return updatedTask == null ? NotFound() : Ok(updatedTask);
        }

    
        [HttpDelete("{id}")]
        public IActionResult DeleteTask(Guid id)
        {
            var success = _taskService.DeleteTask(id);
            return success ? NoContent() : NotFound();
        }
    }
}