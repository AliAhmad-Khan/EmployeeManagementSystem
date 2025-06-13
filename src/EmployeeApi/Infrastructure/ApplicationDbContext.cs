using Microsoft.EntityFrameworkCore;
using EmployeeApi.Domain;

namespace EmployeeApi.Infrastructure;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
    public DbSet<Employee> Employees { get; set; }
}
