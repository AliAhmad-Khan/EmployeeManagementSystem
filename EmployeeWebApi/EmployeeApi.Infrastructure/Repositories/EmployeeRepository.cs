using Microsoft.EntityFrameworkCore;
using EmployeeApi.Domain.Entities;
using EmployeeApi.Domain.Interfaces;
using EmployeeApi.Infrastructure.Data;
using EmployeeApi.Domain.Common.Models;

namespace EmployeeApi.Infrastructure.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly ApplicationDbContext _db;

        public EmployeeRepository(ApplicationDbContext db)
        {
            _db = db;
        }


        public async Task<PagedResponse<Employee>> GetPagedAsync(int pageNumber, int pageSize, string? searchTerm)
        {
            var query = _db.Employees.AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var lowerTerm = searchTerm.ToLower();
                query = query.Where(e =>
                    e.Name.ToLower().Contains(lowerTerm) ||
                    e.Email.ToLower().Contains(lowerTerm) ||
                    e.Department.ToLower().Contains(lowerTerm));
            }

            var total = await query.CountAsync();

            var items = await query
                .OrderBy(e => e.Name)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .AsNoTracking()
                .ToListAsync();

            return new PagedResponse<Employee>(
                items,
                total,
                pageNumber,
                pageSize);
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
