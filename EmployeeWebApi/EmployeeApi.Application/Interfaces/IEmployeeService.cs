using EmployeeApi.Application.DTOs;
using EmployeeApi.Domain.Common.Models;

namespace EmployeeApi.Application.Interfaces
{
    public interface IEmployeeService
    {
        Task<PagedResponse<EmployeeDto>> GetPagedAsync(int pageNumber, int pageSize, string? searchTerm);

        Task<EmployeeDto> GetByIdAsync(Guid id);
        Task<IReadOnlyList<EmployeeDto>> GetAllAsync();
        Task<Guid> CreateAsync(EmployeeDto dto);
        Task UpdateAsync(EmployeeDto dto);
        Task DeleteAsync(Guid id);
    }
}
