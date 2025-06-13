using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeeApi.Infrastructure;
using EmployeeApi.Dtos;
using EmployeeApi.Domain;

namespace EmployeeApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public EmployeesController(ApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<IEnumerable<EmployeeDto>> Get(string? search)
    {
        var query = _db.Employees.AsQueryable();
        if (!string.IsNullOrEmpty(search))
            query = query.Where(e => e.Name.Contains(search) || e.Email.Contains(search) || e.Department.Contains(search));
        var list = await query.ToListAsync();
        return list.Select(e => new EmployeeDto { Id = e.Id, Name = e.Name, Email = e.Email, DateOfBirth = e.DateOfBirth, Department = e.Department });
    }

    [HttpPost]
    public async Task<IActionResult> Create(EmployeeDto dto)
    {
        var emp = new Employee { Id = Guid.NewGuid(), Name = dto.Name, Email = dto.Email, DateOfBirth = dto.DateOfBirth, Department = dto.Department };
        _db.Employees.Add(emp);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = emp.Id }, dto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, EmployeeDto dto)
    {
        var emp = await _db.Employees.FindAsync(id);
        if (emp == null) return NotFound();
        emp.Name = dto.Name; emp.Email = dto.Email; emp.DateOfBirth = dto.DateOfBirth; emp.Department = dto.Department;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var emp = await _db.Employees.FindAsync(id);
        if (emp == null) return NotFound();
        _db.Employees.Remove(emp);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
