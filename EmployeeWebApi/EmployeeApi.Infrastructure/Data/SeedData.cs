using EmployeeApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApi.Infrastructure.Data
{
    public static class SeedData
    {
        public static void Initialize(ApplicationDbContext context)
        {
            if (context.Employees.Any())
                return;

            var employees = new List<Employee>();
            for (int i = 1; i <= 100; i++)
            {
                employees.Add(new Employee
                {
                    Id = Guid.NewGuid(),
                    Name = $"First{i}",
                    Email = $"user{i}@example.com",
                    DateOfBirth = DateTime.Today.AddYears(-20).AddDays(i),
                    Department = i % 2 == 0 ? "Engineering" : "HR"
                });
            }

            context.Employees.AddRange(employees);
            context.SaveChanges();
        }
    }
}
