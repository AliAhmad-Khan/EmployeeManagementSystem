using EmployeeApi.Domain.Entities;
using EmployeeApi.Domain.Common.Models;

namespace EmployeeApi.Domain.Interfaces
{
    public interface IEmployeeRepository
    {
        Task<PagedResponse<Employee>> GetPagedAsync(int pageNumber, int pageSize, string? searchTerm);

        Task<Employee?> GetByIdAsync(Guid id);
        Task<IReadOnlyList<Employee>> GetAllAsync();
        Task AddAsync(Employee employee);
        Task UpdateAsync(Employee employee);
        Task DeleteAsync(Guid id);
    }
}
