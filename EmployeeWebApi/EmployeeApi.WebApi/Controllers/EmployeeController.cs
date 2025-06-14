using EmployeeApi.Application.DTOs;
using EmployeeApi.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeApi.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _service;

        public EmployeesController(IEmployeeService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string? search)
        {
            var list = await _service.GetAllAsync();
            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();
                list = list.Where(e =>
                    (!string.IsNullOrEmpty(e.Name) && e.Name.ToLower().Contains(search)) ||
                    (!string.IsNullOrEmpty(e.Email) && e.Email.ToLower().Contains(search)) ||
                    (!string.IsNullOrEmpty(e.Department) && e.Department.ToLower().Contains(search))
                ).ToList();
            }
            return Ok(list);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var dto = await _service.GetByIdAsync(id);
            if (dto is null) return NotFound();
            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Create(EmployeeDto dto)
        {
            var newId = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = newId }, null);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, EmployeeDto dto)
        {
            if (id != dto.Id) return BadRequest("ID mismatch");
            await _service.UpdateAsync(dto);
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
