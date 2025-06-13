using Microsoft.EntityFrameworkCore;
using EmployeeApi.Domain.Entities;
using EmployeeApi.Domain.Interfaces;
using EmployeeApi.Infrastructure.Data;

namespace EmployeeApi.Infrastructure.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly ApplicationDbContext _db;

        public EmployeeRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(Employee employee)
        {
            await _db.Employees.AddAsync(employee);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var existing = await _db.Employees.FindAsync(id);
            if (existing is not null)
            {
                _db.Employees.Remove(existing);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<IReadOnlyList<Employee>> GetAllAsync()
            => await _db.Employees.AsNoTracking().ToListAsync();

        public async Task<Employee?> GetByIdAsync(Guid id)
            => await _db.Employees.AsNoTracking()
                                  .FirstOrDefaultAsync(e => e.Id == id);

        public async Task UpdateAsync(Employee employee)
        {
            _db.Employees.Update(employee);
            await _db.SaveChangesAsync();
        }
    }
}
