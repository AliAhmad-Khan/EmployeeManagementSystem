using AutoMapper;
using EmployeeApi.Application.DTOs;
using EmployeeApi.Application.Interfaces;
using EmployeeApi.Domain.Interfaces;
using EmployeeApi.Domain.Entities;

namespace EmployeeApi.Application.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _repo;
        private readonly IMapper _mapper;

        public EmployeeService(IEmployeeRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<Guid> CreateAsync(EmployeeDto dto)
        {
            var entity = _mapper.Map<Employee>(dto);
            entity.Id = Guid.NewGuid();
            await _repo.AddAsync(entity);
            return entity.Id;
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repo.DeleteAsync(id);
        }

        public async Task<IReadOnlyList<EmployeeDto>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            return _mapper.Map<IReadOnlyList<EmployeeDto>>(list);
        }

        public async Task<EmployeeDto?> GetByIdAsync(Guid id)
        {
            var entity = await _repo.GetByIdAsync(id);
            return entity is null ? null : _mapper.Map<EmployeeDto>(entity);
        }

        public async Task UpdateAsync(EmployeeDto dto)
        {
            var entity = _mapper.Map<Employee>(dto);
            await _repo.UpdateAsync(entity);
        }
    }
}
