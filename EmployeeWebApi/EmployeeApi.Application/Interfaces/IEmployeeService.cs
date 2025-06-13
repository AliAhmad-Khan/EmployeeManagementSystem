using EmployeeApi.Application.DTOs;

namespace EmployeeApi.Application.Interfaces
{
    public interface IEmployeeService
    {
        Task<EmployeeDto?> GetByIdAsync(Guid id);
        Task<IReadOnlyList<EmployeeDto>> GetAllAsync();
        Task<Guid> CreateAsync(EmployeeDto dto);
        Task UpdateAsync(EmployeeDto dto);
        Task DeleteAsync(Guid id);
    }
}
