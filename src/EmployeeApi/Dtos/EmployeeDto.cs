using System;

namespace EmployeeApi.Dtos;

public class EmployeeDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string Email { get; set; } = default!;
    public DateTime DateOfBirth { get; set; }
    public string Department { get; set; } = default!;
}
